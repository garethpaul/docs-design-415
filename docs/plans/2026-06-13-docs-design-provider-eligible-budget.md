# Consume Docs Design Capacity Only for Provider-Eligible Requests

Status: Completed

## Context

The docs design execute route consumes its process-local fixed-window capacity
before Content-Type, body, code, parameter, and API-key validation. Invalid
traffic can therefore exhaust every provider request slot without becoming
eligible to call OpenAI.

## Requirements

- Preserve the existing ten-request, sixty-second fixed-window behavior, `429`
  response, and `Retry-After` header for provider-eligible requests.
- Reject every locally invalid or unconfigured request before consuming
  capacity.
- Enforce capacity immediately before provider client construction.
- Preserve enablement, parser, model, timeout, retry, and error boundaries.
- Add runtime and ordered static contracts for both early-consumption and
  post-client bypass regressions.

## Scope Boundaries

- Do not change the process-local budget size, window duration, response
  payloads, dependencies, or UI.
- Do not add shared state, authentication, or a live provider request.
- Do not alter parser acceptance.

## Implementation

- Move route capacity enforcement after local validation and API-key checks.
- Exhaust the real module-level limiter in an offline handler regression and
  prove an invalid Content-Type remains `415` rather than `429`.
- Update the baseline checker, project guidance, and completed-plan evidence.

## Verification

- Run `make check` on Node.js 20, 22, and 24.
- Run the rooted check from an external working directory.
- Run isolated hostile mutations for ordering, bypass, regression, docs, and
  completed-plan evidence.
- Audit manifests, lockfiles, workflow, UI, generated artifacts, whitespace,
  shell syntax, and credential-like additions.

## Risks

- The limiter remains process-local and unauthenticated; public multi-instance
  deployments still require shared identity-aware enforcement.
- Locally valid attempts that fail upstream intentionally consume capacity.

## Work Completed

- Moved capacity consumption after Content-Type, body, code, parameter, and
  API-key validation and immediately before provider setup.
- Added an offline exhausted-window handler regression proving invalid traffic
  remains a `415` response.
- Added ordered source, test, project-guidance, contributor-guidance, and plan
  contracts without changing dependencies, UI, or parser acceptance.

## Verification Completed

- Node.js 20.19.5, 22.22.2, and 24.16.0 `make check` passed type-check,
  parser tests, clean Webpack production builds, baseline contracts, and
  moderate-severity audits with zero vulnerabilities.
- The rooted external-working-directory `make check` passed on Node.js 20.19.5.
- Node.js 20.19.5 focused parser and type-check gates passed.
- The isolated temporary final-state checker and parser suite passed.
- Nine isolated hostile mutations were rejected across early consumption,
  post-client enforcement, API-key bypass, limiter bypass, regression drift,
  README, contributor guidance, and plan status.
- Shell syntax and `git diff --check` passed.
- No live OpenAI request, real credential, browser automation, or deployment was used.
