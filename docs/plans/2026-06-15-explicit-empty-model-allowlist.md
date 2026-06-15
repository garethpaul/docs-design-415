# Explicit Empty Model Allowlist

Status: Completed

## Problem

The docs-design execute route uses its built-in model allowlist when
`OPENAI_ALLOWED_MODELS` is unset. It currently uses the same fallback when the
variable is explicitly set to whitespace or comma-only content, so malformed
deployment configuration silently reopens default models rather than denying
all provider requests.

## Priorities

1. P0: fail closed for explicitly empty model configuration before provider
   eligibility is established.
2. P1: execute the exact stacked route in a synthetic deployment and record
   sanitized integration evidence.
3. P2: run responsive browser verification and revisit the maintained provider
   and model matrix before any allowlist expansion.

## Requirements

1. Use built-in models only when `OPENAI_ALLOWED_MODELS` is absent.
2. Treat blank, whitespace-only, or comma-only configuration as an empty set.
3. Continue intersecting configured names with the built-in maximum set.
4. Add parser regressions and mutation-sensitive source, documentation, and
   completed-plan contracts.
5. Preserve request parsing, provider setup, rate limiting, no-store responses,
   and UI behavior outside model eligibility.

## Scope Boundaries

- Do not add models or modify the built-in model set.
- Do not normalize names beyond existing comma splitting and trimming.
- Do not change authentication, credentials, dependencies, request budgets,
  response strings, or responsive layout behavior.
- Do not claim browser, deployed-route, or live-provider execution.
- Do not merge or close stacked pull requests without explicit authorization.

## Implementation

1. Distinguish an undefined environment variable from an explicitly configured
   string in `pages/api/execute/code.ts`.
2. Return defaults only for the undefined case; return the configured
   intersection otherwise, including an empty set.
3. Add focused whitespace-only and comma-only parser regressions.
4. Extend `scripts/check-baseline.sh` and repository guidance with the exact
   fail-closed contract.
5. Run test-first verification, hostile mutations, Node 20 and Node 24
   `make check`, an external-directory gate, and final artifact, secret, and
   diff audits.

## Verification

- The test-first parser run failed because whitespace configuration still
  admitted `gpt-4o-mini`; the execute parser tests passed after the source fix.
- Six hostile mutations were rejected for the explicit unset branch, fallback
  behavior, focused fixture, README, security guidance, and completed plan
  evidence.
- Node 20.19.5 and Node 24.16.0 `make check` passed, including TypeScript,
  parser tests, a clean Webpack production build, static contracts, and
  zero-vulnerability moderate audits; Node 20 also passed from an external working directory.
- This change claims no browser, deployed-route, or live-provider execution.
