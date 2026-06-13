---
title: Docs Design OpenAI Request Timeout
type: reliability
status: in_progress
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

## Non-Goals

- Changing request models, parsing, response payloads, or UI behavior.
- Adding route-level retries, streaming, queues, or cancellation UI.
- Performing a live OpenAI request.

## Work In Progress

- Add immutable timeout and retry options to the provider call.
- Extend offline assertions, static contracts, and project guidance.
- Run focused, full, and hostile-mutation verification.

## Current Verification

- Node 20.19.5: parser tests, TypeScript checks, and the static baseline passed.
- Removing the per-request options failed the static baseline.
- Restoring two SDK retries failed the executable parser assertion.
- `npm test` passed type checks, parser tests, the production Webpack build,
  and the baseline, then stopped at the unchanged `esbuild 0.28.0` audit
  finding already addressed by independent Dependabot pull request 4.
