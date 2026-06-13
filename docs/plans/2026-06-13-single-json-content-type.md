---
title: Single JSON Content Type
type: security
date: 2026-06-13
status: planned
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
