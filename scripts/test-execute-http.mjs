import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer, request as httpRequest } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

function deferred() {
  let resolve;
  const promise = new Promise((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}

async function reservePort() {
  const server = createServer();
  const port = await listen(server);
  server.close();
  await once(server, "close");
  return port;
}

async function waitForServer(url, child) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next server exited with code ${child.exitCode}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for Next server");
}

const validCode = (content) => `await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: ${JSON.stringify(content)} }]
});`;

const docsContent = JSON.parse(
  readFileSync(new URL("../components/docs-content.json", import.meta.url), "utf8"),
);
const docsRoutes = docsContent.sections.flatMap((section) =>
  section.links.map((topic) => ({ href: topic.href, title: topic.title })),
);

const slowRequestStarted = deferred();
const slowRequestDisconnected = deferred();
let providerRequests = 0;
const provider = createServer(async (request, response) => {
  providerRequests += 1;
  let body = "";
  for await (const chunk of request) body += chunk;
  const payload = JSON.parse(body);
  const content = payload.messages?.[0]?.content;

  if (content === "provider-error") {
    response.writeHead(401, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: { message: "test-openai-key must stay secret" } }));
    return;
  }

  if (content === "slow") {
    slowRequestStarted.resolve();
    response.on("close", () => {
      if (!response.writableEnded) slowRequestDisconnected.resolve();
    });
    setTimeout(() => {
      if (!response.destroyed) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ choices: [{ message: { content: "late" } }] }));
      }
    }, 2_000);
    return;
  }

  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ choices: [{ message: { content: "ok" } }] }));
});

const providerPort = await listen(provider);
const nextPort = await reservePort();
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(nextPort)], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    DOCS_EXECUTE_ENABLED: "true",
    EXECUTE_API_TOKEN: "test-execute-token",
    OPENAI_API_KEY: "test-openai-key",
    OPENAI_BASE_URL: `http://127.0.0.1:${providerPort}/v1`,
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let nextOutput = "";
next.stdout.on("data", (chunk) => { nextOutput += chunk; });
next.stderr.on("data", (chunk) => { nextOutput += chunk; });

const route = `http://127.0.0.1:${nextPort}/api/execute/code`;
try {
  await waitForServer(`http://127.0.0.1:${nextPort}/docs`, next);

  for (const topic of docsRoutes) {
    const response = await fetch(`http://127.0.0.1:${nextPort}${topic.href}`);
    assert.equal(response.status, 200, `${topic.href} must resolve`);
    assert.match(await response.text(), new RegExp(`<h1[^>]*>${topic.title}</h1>`));
  }

  for (const missingPath of [
    "/docs/introduction",
    "/docs/Get-Started/introduction",
    "/docs/get-started/not-a-topic",
  ]) {
    const response = await fetch(`http://127.0.0.1:${nextPort}${missingPath}`);
    assert.equal(response.status, 404, `${missingPath} must not alias a topic route`);
  }

  const trailingSlash = await fetch(
    `http://127.0.0.1:${nextPort}${docsRoutes[0].href}/`,
    { redirect: "manual" },
  );
  assert.equal(trailingSlash.status, 308);
  assert.equal(
    new URL(trailingSlash.headers.get("location"), `http://127.0.0.1:${nextPort}`).pathname,
    docsRoutes[0].href,
  );

  const unauthorized = await fetch(route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: validCode("unauthorized") }),
  });
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.headers.get("cache-control"), "no-store");
  assert.equal(providerRequests, 0);

  const ambiguous = await fetch(route, {
    method: "POST",
    headers: {
      Authorization: "Bearer test-execute-token",
      "Content-Type": "application/json; charset=utf-8, text/plain",
    },
    body: JSON.stringify({ code: validCode("ambiguous") }),
  });
  assert.equal(ambiguous.status, 415);
  assert.equal(ambiguous.headers.get("cache-control"), "no-store");
  assert.equal(providerRequests, 0);

  const successful = await fetch(route, {
    method: "POST",
    headers: {
      Authorization: "Bearer test-execute-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: validCode("success") }),
  });
  assert.equal(successful.status, 200);
  assert.equal(successful.headers.get("cache-control"), "no-store");
  assert.deepEqual(await successful.json(), [{ message: { content: "ok" } }]);

  const providerError = await fetch(route, {
    method: "POST",
    headers: {
      Authorization: "Bearer test-execute-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: validCode("provider-error") }),
  });
  assert.equal(providerError.status, 502);
  const providerErrorBody = await providerError.text();
  assert.equal(providerError.headers.get("cache-control"), "no-store");
  assert.equal(providerErrorBody, JSON.stringify({ error: "OpenAI request failed" }));
  assert.doesNotMatch(providerErrorBody, /test-openai-key/);

  const slowBody = JSON.stringify({ code: validCode("slow") });
  const slowRequest = httpRequest(route, {
    method: "POST",
    headers: {
      Authorization: "Bearer test-execute-token",
      "Content-Length": Buffer.byteLength(slowBody),
      "Content-Type": "application/json",
    },
  });
  const slowRequestError = once(slowRequest, "error");
  slowRequest.end(slowBody);
  await slowRequestStarted.promise;
  slowRequest.destroy(new Error("test client disconnected"));
  await slowRequestError;
  const disconnected = await Promise.race([
    slowRequestDisconnected.promise.then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(false), 500)),
  ]);
  assert.equal(disconnected, true);
} finally {
  next.kill("SIGTERM");
  if (next.exitCode === null) await once(next, "exit");
  provider.closeAllConnections();
  provider.close();
  await once(provider, "close");
}

if (nextOutput.includes("test-openai-key")) {
  throw new Error("Server output exposed a test credential");
}
console.log("execute live HTTP tests passed");
