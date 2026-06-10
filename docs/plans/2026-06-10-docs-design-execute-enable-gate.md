---
title: Docs Design Execute Enable Gate
type: security
status: completed
date: 2026-06-10
---

# Docs Design Execute Enable Gate

## Summary

Keep the design prototype's spend-capable OpenAI route disabled unless an
operator explicitly enables it separately from configuring the provider key.

## Work Completed

- Added strict, whitespace-normalized `DOCS_EXECUTE_ENABLED=true` semantics.
- Rejects disabled requests with a generic 503 before parsing or provider setup.
- Added parser-suite coverage for missing, false, numeric-style, yes-style, and
  normalized true values.
- Documented that the interlock does not replace public authentication or rate
  limiting.
- Rooted all Make targets, pinned CI to Ubuntu 24.04, and extended the baseline.

## Verification

- `npm ci`
- `npm run test:parser`
- `npm test`
- `make check`
- `make -f /absolute/path/to/Makefile check`
- Mutation checks for permissive enablement, missing tests, runner drift,
  unrooted Make targets, and incomplete plan status
- `sh -n scripts/check-baseline.sh`
- `git diff --check`

No OpenAI request was sent and no application was deployed during this pass.
