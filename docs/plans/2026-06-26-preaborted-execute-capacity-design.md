# Pre-Aborted Execute Capacity Design

status: completed

## Problem

The execute route validates a request and consumes one process-local fixed-window
budget slot before it checks the existing `req.aborted` signal. A client that is
already disconnected can therefore exhaust execute capacity even though its
request is no longer provider-eligible and no response can be delivered.

## Evidence

- `pages/api/execute/code.ts` calls `enforceExecuteRateLimit` before creating the
  abort controller and inspecting `req.aborted`.
- The route already treats client disconnect as a reason to stop provider work.
- `scripts/test-execute-provider.ts` runs the real OpenAI client against a local
  upstream and can prove both capacity preservation and cancellation behavior.

## Options Considered

1. Refund capacity in the abort catch path. This requires reversible limiter
   state and races with aborts after provider work has begun.
2. Ignore the issue because an already-aborted signal usually prevents network
   I/O. This still lets abandoned requests consume scarce process-local budget.
3. Return immediately when `req.aborted` is already true after all local request
   validation and provider configuration checks, but before rate-limit admission.

## Decision

Use option 3. Preserve authentication, request validation, model restrictions,
and API-key configuration ordering. Treat only a still-connected, locally valid,
provider-configured request as eligible to consume execute capacity. Existing
listeners and abort signals continue to own disconnects that occur after
admission.

## Validation

- Add a provider test that sends ten already-aborted valid requests, then proves
  a connected request can still reach the local upstream.
- Keep the existing in-flight abort test proving the upstream connection closes.
- Add mutation-sensitive source and guidance contracts.
- Run the full Node 20/22/24 and hosted verification gates.

## Verification Completed

- Removing the early disconnect guard reproduced
  `connected request did not reach upstream; status 429`.
- `npm run test:provider` and `npm run test:parser` pass with the guard restored.
- `make check` passes on Node.js 20.20.2, 22.16.0, and 24.17.0 with seven
  hostile mutations rejected and zero audit vulnerabilities.
- External Make passes from `/tmp` on Node.js 24.17.0.
- Hosted checks and exact-head review are pending.
