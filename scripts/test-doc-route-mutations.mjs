import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { collectContractErrors } from "./test-doc-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function withFixture(mutate, expectedError) {
  const fixture = mkdtempSync(join(tmpdir(), "docs-routes-"));
  try {
    cpSync(join(root, "components"), join(fixture, "components"), { recursive: true });
    cpSync(join(root, "pages"), join(fixture, "pages"), { recursive: true });
    mutate(fixture);
    const errors = collectContractErrors(fixture);
    assert.ok(
      errors.some((error) => error.includes(expectedError)),
      `expected mutation error containing ${JSON.stringify(expectedError)}, got:\n${errors.join("\n")}`,
    );
  } finally {
    rmSync(fixture, { force: true, recursive: true });
  }
}

function mutateData(fixture, mutate) {
  const path = join(fixture, "components", "docs-content.json");
  const content = JSON.parse(readFileSync(path, "utf8"));
  mutate(content);
  writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`);
}

withFixture(
  (fixture) => rmSync(join(fixture, "pages", "docs", "[section]", "[slug].tsx")),
  "missing destination:",
);

withFixture(
  (fixture) => mutateData(fixture, ({ sections }) => {
    sections[0].links[1].slug = sections[0].links[0].slug;
    sections[0].links[1].href = sections[0].links[0].href;
  }),
  "duplicate destination:",
);

withFixture(
  (fixture) => mutateData(fixture, ({ sections }) => {
    sections[0].links[0].slug = "Introduction";
    sections[0].links[0].href = "/docs/get-started/Introduction";
  }),
  "lacks a canonical lowercase slug",
);

withFixture(
  (fixture) => mutateData(fixture, ({ sections }) => {
    sections[0].links[0].summary = "Coming soon";
  }),
  "lacks meaningful content",
);

for (const badHref of [
  "/docs/introduction",
  "/docs/Get-Started/introduction",
  "/docs/get-started/introduction/",
]) {
  withFixture(
    (fixture) => mutateData(fixture, ({ sections }) => {
      sections[0].links[0].href = badHref;
    }),
    "href must equal /docs/get-started/introduction",
  );
}

withFixture(
  (fixture) => {
    const path = join(fixture, "components", "Sidebar.tsx");
    const source = readFileSync(path, "utf8").replace(
      "href={topic.href}",
      'href="/docs/get-started/introduction" /* href={topic.href} */',
    );
    writeFileSync(path, source);
  },
  "sidebar hrefs are not sourced from the shared route declaration",
);

withFixture(
  (fixture) => {
    const path = join(fixture, "pages", "docs", "[section]", "[slug].tsx");
    const source = readFileSync(path, "utf8").replace(
      "paths: docsContent.sections.flatMap",
      "paths: [].flatMap /* paths: docsContent.sections.flatMap */",
    );
    writeFileSync(path, source);
  },
  "dynamic route lacks paths: docsContent.sections.flatMap",
);

console.log("documentation route hostile mutations passed");
