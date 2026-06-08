---
title: docs-design-415 execute API baseline
date: 2026-06-08
status: completed
execution: code
---

## Context

This docs design prototype includes the same browser editor to Next.js execute API path as the sibling docs prototype, with additional layout and docs-route components around it. The existing API extracted OpenAI chat completion parameters with regex/string conversion, logged request-derived values, and depended on floating or vulnerable package versions.

## Goals

- Replace regex/string parsing with AST-only extraction for `openai.chat.completions.create({ ... })` examples.
- Accept only one static chat completion call with bounded literal parameters and a model allow-list.
- Validate request method, body size, API key configuration, model, messages, token limits, and optional completion settings before calling OpenAI.
- Stop logging submitted code, parsed parameters, provider responses, or raw provider errors.
- Add a repeatable verification gate covering TypeScript, parser regression tests, production build, source guards, and high-severity audit.

## Scope Boundaries

- Keep the existing Pages Router, editor component, and docs design layout.
- Do not add authentication, persistence, streaming, or a new docs navigation model.
- Do not change GitHub Actions workflows in this pass.

## Implementation Units

### U1: Safe execute API extraction

Files: `pages/api/execute/code.ts`, `scripts/test-execute-parser.ts`

Approach: Parse submitted code with Babel, extract only direct `openai.chat.completions.create({ ... })` calls, reject dynamic values and duplicate keys, and normalize an allow-listed chat completion subset.

Verification: Parser tests cover a valid request, missing calls, dynamic model values, invalid roles, oversized content, multiple matching calls, duplicate parameters, and negative penalty literals.

### U2: Editor request guardrails

Files: `components/Editor.tsx`

Approach: Submit the current editor string directly, clear stale results between runs, display API errors without logging prompt content, and remove JSX attributes that break TypeScript.

Verification: Type-check and source guards confirm the editor no longer double-encodes submitted code or logs request/response data.

### U3: Reproducible tooling baseline

Files: `package.json`, `package-lock.json`, `tsconfig.json`, `global.d.ts`, `scripts/check-baseline.sh`, `README.md`, `VISION.md`

Approach: Pin framework/tooling dependencies, declare Node 20.9+, add parser and baseline checks, document `OPENAI_API_KEY` and `OPENAI_ALLOWED_MODELS`, and make `npm test` the local shipping gate.

Verification: `npm test`, `npm audit --audit-level=high`, and `git diff --check` pass on the default `docs-page` branch.
