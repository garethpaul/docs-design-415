---
title: docs-design-415 Whitespace Message Guard
date: 2026-06-09
status: completed
execution: code
---

## Context

The execute API rejects empty message strings by length, but whitespace-only
message content can still pass validation and be proxied to OpenAI as a blank
prompt.

## Goals

- Reject whitespace-only message content before proxying a chat completion.
- Add parser regression coverage for blank prompt content.
- Extend the source baseline so the guard remains visible.
- Document the validation contract in README and project direction notes.

## Verification

- `npm run test:parser`
- `npm test`
- `make check`
- `git diff --check`
