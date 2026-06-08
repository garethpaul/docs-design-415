import assert from "node:assert/strict";
import {
  extractParameters,
  normalizeChatRequest,
} from "../pages/api/execute/code";

function parseAndNormalize(code: string) {
  return normalizeChatRequest(extractParameters(code));
}

const validRequest = parseAndNormalize(`
  import OpenAI from "openai";

  const openai = new OpenAI();
  async function main() {
    return openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Be brief." },
        { role: "user", content: "Say this is a test." }
      ],
      max_tokens: 128,
      temperature: 0.2,
      presence_penalty: -1,
      response_format: { type: "text" }
    });
  }
`);

assert.deepEqual(validRequest, {
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "Be brief." },
    { role: "user", content: "Say this is a test." },
  ],
  max_tokens: 128,
  temperature: 0.2,
  presence_penalty: -1,
  response_format: { type: "text" },
});

assert.equal(parseAndNormalize("const value = 1;"), null);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: process.env.MODEL,
      messages: [{ role: "user", content: "Hello" }]
    });
  `),
  null,
);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "tool", content: "Hello" }]
    });
  `),
  null,
);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: ${JSON.stringify("x".repeat(8001))} }]
    });
  `),
  null,
);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "One" }]
    });
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Two" }]
    });
  `),
  null,
);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
      stream: true
    });
  `),
  null,
);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Duplicate model" }]
    });
  `),
  null,
);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: "not-allowed",
      messages: [{ role: "user", content: "Hello" }]
    });
  `),
  null,
);

assert.equal(
  parseAndNormalize(`
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 4096
    });
  `),
  null,
);

const originalAllowedModels = process.env.OPENAI_ALLOWED_MODELS;
process.env.OPENAI_ALLOWED_MODELS = "docs-preview-model";

try {
  assert.equal(
    parseAndNormalize(`
      await openai.chat.completions.create({
        model: "docs-preview-model",
        messages: [{ role: "user", content: "Use configured model." }]
      });
    `)?.model,
    "docs-preview-model",
  );
} finally {
  if (originalAllowedModels === undefined) {
    delete process.env.OPENAI_ALLOWED_MODELS;
  } else {
    process.env.OPENAI_ALLOWED_MODELS = originalAllowedModels;
  }
}

console.log("execute parser tests passed.");
