import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const mutations = [
  {
    name: "parameterized duplicate content types",
    file: "pages/api/execute/code.ts",
    from: 'typeof contentType !== "string" || contentType.includes(",")',
    to: 'typeof contentType !== "string"',
    command: ["npm", "run", "test:parser"],
  },
  {
    name: "format-control-only messages",
    file: "pages/api/execute/code.ts",
    from: "!hasVisibleMessageContent(content)",
    to: 'content.trim().length === 0',
    command: ["npm", "run", "test:parser"],
  },
  {
    name: "bearer authentication bypass",
    file: "pages/api/execute/code.ts",
    from: "if (!isAuthorized(req.headers.authorization, executeApiToken)) {",
    to: "if (false && !isAuthorized(req.headers.authorization, executeApiToken)) {",
    command: ["npm", "run", "test:parser"],
  },
  {
    name: "missing editor bearer header",
    file: "components/Editor.tsx",
    from: '          Authorization: `Bearer ${executeApiToken}`,\n',
    to: "",
    command: ["npm", "run", "test:parser"],
  },
  {
    name: "persisted editor credential",
    file: "components/Editor.tsx",
    from: '  const [executeApiToken, setExecuteApiToken] = useState("");',
    to: '  const [executeApiToken, setExecuteApiToken] = useState(""); // localStorage is forbidden',
    command: ["npm", "run", "test:parser"],
  },
  {
    name: "uncancelled provider request",
    file: "pages/api/execute/code.ts",
    from: "{ ...OPENAI_REQUEST_OPTIONS, signal: requestAbortController.signal }",
    to: "OPENAI_REQUEST_OPTIONS",
    command: ["npm", "run", "test:provider"],
  },
  {
    name: "pre-aborted execute capacity",
    file: "pages/api/execute/code.ts",
    from: "  if (req.aborted) {\n    return;\n  }\n\n  if (enforceExecuteRateLimit(res)) {",
    to: "  if (enforceExecuteRateLimit(res)) {",
    command: ["npm", "run", "test:provider"],
  },
];

for (const mutation of mutations) {
  const path = fileURLToPath(new URL(mutation.file, `${new URL("..", import.meta.url)}/`));
  const original = readFileSync(path, "utf8");
  assert.ok(original.includes(mutation.from), `missing mutation target: ${mutation.name}`);
  try {
    writeFileSync(path, original.replace(mutation.from, mutation.to));
    const [command, ...args] = mutation.command;
    const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
    assert.notEqual(
      result.status,
      0,
      `mutation survived: ${mutation.name}\n${result.stdout}\n${result.stderr}`,
    );
  } finally {
    writeFileSync(path, original);
  }
}

console.log(`${mutations.length} hostile review mutations rejected`);
