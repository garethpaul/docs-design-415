# Execute Boundary Deep Review

## Status: Completed

## Scope

Review the maintained `docs-design-415` PR stack at PR #16, integrate useful
security intent from divergent PR #2, confirm Dependabot PR #4 is already
represented, and validate the editor, API route, provider boundary, dependency
graph, CI workflow, and deployment behavior without using a live OpenAI key.

## Findings

- The maintained route had no authentication despite documenting that public
  deployment required it.
- Applying PR #2 directly would break the editor flow and carry stale route
  assumptions, so authentication belongs on the maintained head with a
  non-persistent caller token field.
- A combined `Content-Type` value with parameters before the comma bypassed the
  single-value check.
- Format-control-only messages were admitted as nonblank provider work.
- Request-body completion meant `req.aborted` alone did not cover later client
  disconnects; response and socket closure must cancel the SDK request.

## Design

- Keep the existing explicit enable interlock, then require a visible-ASCII
  `EXECUTE_API_TOKEN` bearer credential before media-type or body parsing.
- Compare fixed-length SHA-256 digests with `timingSafeEqual`.
- Keep the editor token in React state only and never persist or publish it.
- Reject any comma-bearing Content-Type value and format-control-only messages.
- Pass an `AbortSignal` to the OpenAI SDK and bind it to request, response, and
  socket disconnect ownership.
- Preserve provider-eligible rate admission after all local checks and before
  provider construction.

## Verification

- Red-first handler assertions for missing, blank, malformed, multi-value, and
  incorrect bearer credentials.
- Red-first parser assertions for parameterized duplicate Content-Type values and
  Unicode format-control-only messages.
- Red-first fake-provider socket assertion proving abandoned upstream work.
- Built Next server live HTTP tests for auth ordering, no-store responses,
  successful proxying, generic provider errors, secret non-disclosure, and
  client-disconnect cancellation.
- Node 20.20.2, 22.23.0, and 24.17.0 passed the full `npm test` gate.
- Six hostile review mutations were rejected, including authentication,
  Content-Type, message visibility, editor credential, and provider abort changes.
- An external working directory passed the full Make gate; the mutation runner
  was corrected after that check exposed caller-directory path dependence.
- A built Next server passed live HTTP checks against a synthetic provider.
- Browser verification covered desktop behavior, the 800-pixel responsive
  breakpoint, token-field enablement, and generic provider error rendering.
- `npm audit --audit-level=moderate` and history-wide redacted Gitleaks scanning
  reported no findings.
- GitHub Actions, Vercel, and final merge evidence are recorded in the pull
  request and repository history because those checks require the committed head.
