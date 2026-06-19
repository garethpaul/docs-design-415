---
title: Docs Design OpenAI Request Timeout
type: reliability
status: completed
date: 2026-06-13
---

# Docs Design OpenAI Request Timeout

## Summary

Bound each enabled execute API provider call to 30 seconds and disable OpenAI
SDK retries so one interactive request cannot expand into multiple long-lived
provider attempts.

## Requirements

- R1. Every OpenAI chat completion request from the execute handler must use a
  30-second timeout.
- R2. Automatic SDK retries must be disabled for this route.
- R3. Request options must be exported as an immutable contract covered by
  offline executable assertions and the static baseline.
- R4. Existing generic provider-error handling must remain unchanged and must
  not expose SDK exception details.
- R5. Project security and maintenance guidance must record the boundary.
- R6. Full verification must retain the independent Dependabot `esbuild 0.28.1`
  lockfile fix rather than weakening the moderate-severity audit gate.

## Non-Goals

- Changing request models, parsing, response payloads, or UI behavior.
- Adding route-level retries, streaming, queues, or cancellation UI.
- Performing a live OpenAI request.

## Work Completed

- Added immutable timeout and retry options to the provider call.
- Extended offline assertions, static contracts, and project guidance.
- Retained the exact lockfile-only `esbuild 0.28.1` update from pull request 4
  and added a static regression contract.

## Verification

- Node 20.19.5: parser tests, TypeScript checks, and the static baseline passed.
- Removing the per-request options failed the static baseline.
- Restoring two SDK retries failed the executable parser assertion.
- The first `npm test` passed type checks, parser tests, the production Webpack
  build, and the baseline, then stopped at the pre-existing `esbuild 0.28.0`
  audit finding already addressed by independent Dependabot pull request 4.
- After retaining that exact lockfile-only update, `npm test` passed type
  checks, parser tests, the production Webpack build, the baseline, and the
  moderate-severity audit with zero vulnerabilities.
- Downgrading the checked lockfile contract to `esbuild 0.28.0` failed the
  static baseline.
- `make check` passed after the completed plan contract was added.
- `git diff --check` passed.
