---
title: Single JSON Content Type
type: security
date: 2026-06-13
status: completed
---

# Single JSON Content Type

## Problem Frame

The docs-design execute route accepts `Content-Type` arrays when any element is
`application/json`. Conflicting duplicate values can therefore pass this
boundary even when another request component interprets the same header as a
different media type.

## Requirements

- R1. Preserve one case-insensitive `application/json` value with optional
  parameters.
- R2. Reject missing, non-string, non-JSON, and every multi-value content type
  before request-body normalization.
- R3. Preserve method, enablement, rate budget, body, parser, provider, timeout,
  retry, no-store, and responsive documentation behavior.
- R4. Deterministic regressions and static contracts must reject restored
  any-match array handling and missing ambiguous-header coverage.

## Scope Boundaries

- Do not change dependencies, lockfiles, workflow configuration, route
  authentication, rate-limit ordering, provider settings, or UI layout.
- Do not enable the execute route or issue a live provider request.
- Do not broaden accepted media types beyond `application/json`.

## Implementation

- Reject non-string values in `hasJsonContentType` before media-type parsing.
- Cover conflicting, duplicate JSON, and empty arrays in the offline parser
  suite while preserving parameterized JSON coverage.
- Extend baseline and project guidance with a helper-scoped, mutation-sensitive
  single-value content-type contract.

## Verification

- Run `make check` on Node.js 20, 22, and 24.
- Run the rooted Make gate from an external working directory.
- Run isolated hostile mutations for array handling, helper scope, regression
  coverage, documentation, and completed plan evidence.
- Audit the exact diff, manifest/lockfile preservation, generated artifacts,
  and credential-like additions before committing.

## Work Completed

- Rejected every non-string content-type value before media-type
  normalization, including conflicting, duplicate, and empty header arrays.
- Preserved one case-insensitive `application/json` value with optional
  parameters.
- Added offline regressions and helper-scoped source contracts for the
  single-value boundary.
- Documented the ambiguous-header rejection without changing UI behavior.

## Verification Completed

- Node.js 20.19.5, 22.22.2, and 24.16.0 `make check` passed TypeScript checks,
  offline parser tests, clean Webpack production builds, baseline contracts,
  and moderate-severity audits with zero vulnerabilities.
- The rooted Make gate passed from an external working directory on Node.js
  20.19.5.
- Eight isolated hostile mutations were rejected across array handling, helper
  scope, accepted media types, regression coverage, documentation, and
  completed plan evidence.
- Shell syntax, `git diff --check`, exact-path inspection, unchanged manifest
  and lockfile checks, generated-artifact inspection, and credential-like
  addition inspection passed.
- The execute route remained disabled; no OpenAI key was used and no live OpenAI request was made.
