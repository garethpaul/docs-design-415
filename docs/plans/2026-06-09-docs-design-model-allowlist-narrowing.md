---
title: docs-design-415 Model Allow-List Narrowing
date: 2026-06-09
status: completed
execution: code
---

## Context

The execute API documents `OPENAI_ALLOWED_MODELS` as a way to narrow accepted
chat models, but the route allowed the environment variable to replace the
checked-in default list. That made deployment configuration capable of widening
the proxy.

## Goals

- Keep `DEFAULT_ALLOWED_MODELS` as the maximum model set.
- Let `OPENAI_ALLOWED_MODELS` narrow that set only to checked-in defaults.
- Reject unsupported environment model names.
- Add parser tests, source guard coverage, and maintenance documentation.

## Verification

- `npm run test:parser`
- `scripts/check-baseline.sh`
- `make check`
- `git diff --check`
