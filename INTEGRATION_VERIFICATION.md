# Docs Design Integration Verification Matrix

Use this matrix for exact-head evidence that cannot be inferred from portable
package checks. Use an isolated synthetic deployment and synthetic execute
requests. Record only sanitized outcomes; never retain API keys, authorization
values, submitted code, provider output, cookies, account identifiers,
screenshots, or logs.

Commit: recorded in aggregate pull request
Pull request: recorded after push
Evidence status: local synthetic route and browser evidence completed; hosted deployment pending

| # | Scenario | Boundary | Required sanitized evidence | Status |
|---|---|---|---|---|
| 1 | Isolated deployment setup | Deployment | Commit, runtime version, region class, and synthetic environment identifier | not run |
| 2 | Disabled execute route | Deployed route | Request class, response status, and disabled error class | not run |
| 3 | Missing provider configuration | Deployed route | Missing-variable class, response status, and provider-call count | not run |
| 4 | Method and media-type restrictions | Local built route | Request/header class, response status, and provider-call count | pass |
| 5 | Desktop docs workspace | Browser | Viewport class, navigation state, and editor visibility | pass |
| 6 | Narrow docs workspace | Browser | Viewport class, stacked-layout state, and overflow result | pass |
| 7 | Valid editor submission | Browser | Synthetic sample class, response status, and rendered result class | blocked |
| 8 | Invalid editor submission | Browser | Invalid-input class, response status, and stable error class | pass |
| 9 | Provider success | Synthetic provider | Model class, response status, choice count, and elapsed-time bucket | pass |
| 10 | Provider failure or timeout | Synthetic provider | Failure class, response status, elapsed-time bucket, and attempt count | pass |
| 11 | Response cache boundary | Local built route | Response class and Cache-Control value | pass |
| 12 | Execute request budget | Local handler | Window class, admitted count, rejection status, and Retry-After class | pass |
| 13 | Browser refresh behavior | Browser | Pre-refresh state, refresh result, and provider-call delta | not run |
| 14 | Public deployment controls | Local built route | Authentication and shared-rate-limit control classes and enforcement result | blocked |

## Evidence Rules

- Replace the aggregate pull-request references with the exact tested head after
  push before treating hosted evidence as final.
- Use only `pass`, `fail`, `blocked`, or `not run`; explain blockers without
  embedding secrets, provider payloads, private identifiers, or machine paths.
- Keep portable package checks, local route tests, responsive browser evidence,
  deployment evidence, and live provider evidence separate.
- A parser test, source check, package build, or static contract cannot mark an
  integration scenario as passed.

Local built-route, responsive-browser, and synthetic-provider scenarios were
executed without live OpenAI credentials. A valid browser submission to a live
provider and production-grade user authorization/shared rate limiting remain
blocked by the deliberate no-credential test boundary. Hosted Vercel build
evidence is recorded on the aggregate pull request.
