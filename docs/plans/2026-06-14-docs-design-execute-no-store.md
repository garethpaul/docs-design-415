---
title: Docs Design Execute No-Store Policy
type: security
status: completed
date: 2026-06-14
---

# Docs Design Execute No-Store Policy

## Summary

Set `Cache-Control: no-store` before every execute API response so submitted
code, provider output, and route errors are not intentionally retained by
browser or shared caches.

## Requirements

- R1. Apply the cache policy before every execute handler branch.
- R2. Preserve all existing status codes, payloads, validation order, provider
  options, and provider-eligible rate-budget placement.
- R3. Export the policy as an immutable source contract and assert it in the
  offline parser suite.
- R4. Make the static baseline reject removal or weakening of the route-wide
  header and record the boundary in contributor and security guidance.
- R5. Complete bounded local validation, isolated hostile mutations, exact-diff
  and artifact audits, and hosted exact-head verification without a live
  provider request or real credential.

## Non-Goals

- Adding authentication or distributed rate limiting.
- Changing accepted request or response payloads.
- Modifying dependencies, lockfiles, workflows, or the editor UI.
- Making a live OpenAI request.

## Work Completed

- Added an exported `no-store` policy and applied it before every execute
  handler branch.
- Added offline assertions for the policy value and both the earliest method
  rejection and a later content-type rejection.
- Extended the static baseline and project guidance with route-wide cache and
  completed-plan contracts.

## Verification

- Node.js 20.19.5: `npm run test:parser` passed.
- Node.js 20.19.5: `npm run type-check` passed.
- A clean-lockfile `npm ci` completed with zero vulnerabilities.
- The isolated baseline passed before seven hostile mutations were rejected:
  policy weakening, header removal, late header placement, constant-assertion
  removal, method-branch assertion removal, documentation removal, and planned
  status restoration.
- Node.js 20.19.5: `make check` passed type-check, parser tests, the production
  build, baseline contracts, and the moderate audit with zero vulnerabilities.
- Exact intended-path, generated-artifact, whitespace, conflict-marker, and
  changed-line credential-pattern audits passed before commit.
- No live OpenAI request, provider credential, or deployment is used.
