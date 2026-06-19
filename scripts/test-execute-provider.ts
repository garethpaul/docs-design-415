import assert from "node:assert/strict";
import { EventEmitter, once } from "node:events";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import type { NextApiRequest, NextApiResponse } from "next";
import executeHandler from "../pages/api/execute/code";

type TestResponse = {
  body: unknown;
  headers: Record<string, string>;
  statusCode: number;
  setHeader(name: string, value: string): void;
  status(code: number): TestResponse;
  json(body: unknown): TestResponse;
};

function createTestResponse(): TestResponse {
  return Object.assign(new EventEmitter(), {
    body: null,
    headers: {},
    statusCode: 200,
    writableEnded: false,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      this.writableEnded = true;
      return this;
    },
  });
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

async function main() {
  const upstreamStarted = deferred();
  const upstreamDisconnected = deferred();
  const upstream = createServer((request, response) => {
    request.resume();
    upstreamStarted.resolve();
    response.on("close", () => {
      if (!response.writableEnded) {
        upstreamDisconnected.resolve();
      }
    });
    setTimeout(() => {
      if (!response.destroyed) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ choices: [{ message: { content: "late" } }] }));
      }
    }, 1_000);
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");
  const address = upstream.address() as AddressInfo;

  const originalEnvironment = {
    DOCS_EXECUTE_ENABLED: process.env.DOCS_EXECUTE_ENABLED,
    EXECUTE_API_TOKEN: process.env.EXECUTE_API_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  };

  try {
    process.env.DOCS_EXECUTE_ENABLED = "true";
    process.env.EXECUTE_API_TOKEN = "test-execute-token";
    process.env.OPENAI_API_KEY = "test-openai-key";
    process.env.OPENAI_BASE_URL = `http://127.0.0.1:${address.port}/v1`;

    const request = Object.assign(new EventEmitter(), {
      aborted: false,
      socket: new EventEmitter(),
      method: "POST",
      headers: {
        authorization: "Bearer test-execute-token",
        "content-type": "application/json",
      },
      body: {
        code: `await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Hello" }]
        });`,
      },
    }) as unknown as NextApiRequest;
    const response = createTestResponse();
    const handlerPromise = executeHandler(
      request,
      response as unknown as NextApiResponse,
    );

    await upstreamStarted.promise;
    Object.assign(request, { aborted: true });
    request.emit("aborted");

    const disconnectedBeforeResponse = await Promise.race([
      upstreamDisconnected.promise.then(() => true),
      new Promise<false>((resolve) => setTimeout(() => resolve(false), 300)),
    ]);

    upstream.closeAllConnections();
    await handlerPromise;

    assert.equal(disconnectedBeforeResponse, true);
    assert.equal(response.body, null);
  } finally {
    for (const [name, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
    upstream.closeAllConnections();
    upstream.close();
    await once(upstream, "close");
  }
}

main().then(
  () => console.log("execute provider tests passed"),
  (error) => {
    console.error(error);
    process.exitCode = 1;
  },
);
