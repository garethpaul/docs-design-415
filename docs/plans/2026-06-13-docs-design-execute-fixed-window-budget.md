---
title: Docs Design Execute Fixed Window Budget
type: security
date: 2026-06-13
status: planned
---

# Docs Design Execute Fixed Window Budget

## Summary

Bound enabled execute-route traffic with a deterministic process-local fixed
window before request parsing or provider setup, returning `429` and
`Retry-After` when the application process has exhausted its minute budget.

## Problem Frame

The route defaults off and limits each individual OpenAI request to one
30-second zero-retry attempt, but an enabled process still admits unlimited
POST attempts. Bursts can therefore multiply parsing work and provider spend.

## Prioritized Engineering Tasks

1. Enforce ten enabled execute POST attempts per process per 60-second window.
2. Prove capacity, rejection, retry timing, rollover, backward-clock recovery,
   invalid configuration, and route response behavior without network access.
3. Add mutation-sensitive baseline and contributor documentation contracts.
4. Preserve shared authentication and distributed rate limiting as explicit
   deployment follow-up rather than overstating this local safety layer.

## Requirements

- R1. The enabled route must admit at most ten POST attempts per process in a
  60-second window.
- R2. Excess attempts must return `429` with a positive integer `Retry-After`
  before content, body, code, or provider processing.
- R3. The limiter must reset after a complete window and recover safely when
  the clock moves backward.
- R4. Invalid capacity, window, or timestamp inputs must fail explicitly.
- R5. Existing method, enable-gate, request validation, parser, provider,
  timeout, retry, and UI behavior must remain unchanged.
- R6. `make check` must enforce implementation, deterministic tests,
  documentation, and completed-plan evidence.

## Key Technical Decisions

- Use one module-scoped fixed-window limiter shared by requests in the same
  application process.
- Consume capacity for every enabled POST before content validation so malformed
  traffic cannot bypass the work boundary.
- Export a pure timestamp-driven limiter factory and a synchronous response
  enforcement helper for deterministic tests.
- Document that replicas and restarts have independent counters and still need
  shared upstream controls.

## Implementation Units

### U1. Add Execute Request Budget

- **Files:** `pages/api/execute/code.ts`
- **Goal:** Add validated fixed-window state, bounded retry timing, and early
  route rejection.
- **Covers:** R1, R2, R3, R4, R5

### U2. Add Deterministic Regressions

- **Files:** `scripts/test-execute-parser.ts`
- **Goal:** Cover pure limiter boundaries and synchronous route rejection
  without enabling provider work.
- **Covers:** R1, R2, R3, R4

### U3. Enforce And Document The Boundary

- **Files:** `scripts/check-baseline.sh`, `README.md`, `SECURITY.md`, `VISION.md`,
  `CHANGES.md`, `AGENTS.md`
- **Goal:** Preserve source ordering, tests, deployment limitations, and
  completed verification through the full repository gate.
- **Covers:** R6

## Verification

- Run parser tests, typecheck, production build, dependency audit, `make check`,
  and the rooted external-working-directory wrapper on supported Node versions.
- Run whitespace, exact-path, lockfile, secret-pattern, and artifact checks.
- Reject isolated mutations for changed capacity/window, removed enforcement or
  response guidance, changed status, removed rollover/clock/route regressions,
  documentation drift, and incomplete plan evidence.
- Run the prescribed browser skill when available; do not substitute another
  automation tool if `agent-browser` is absent.
- Do not enable the deployed route, use an OpenAI key, make live requests, or
  claim distributed multi-instance enforcement.

## Risks

- Serverless instances, replicas, and process restarts have separate budgets.
- Malformed enabled POST attempts intentionally consume capacity.
- A shared edge or datastore-backed limiter remains necessary for a public
  scaled deployment.
