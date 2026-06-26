# Changes

## 2026-06-26 07:41 PDT

Priority: correctness and provider-capacity preservation.

Summary:

- Prevented already-disconnected execute requests from consuming the
  process-local fixed-window provider budget.

Work completed:

- Added an early disconnect boundary after local validation and API-key
  configuration but before rate-limit admission.
- Added a real-provider-harness regression covering ten abandoned requests,
  one connected request, and the existing in-flight cancellation behavior.
- Added hostile mutation, baseline, documentation, and implementation-plan
  contracts for the new ordering.

Threads:

- Execute API correctness, disconnect lifecycle, rate-limit admission, and
  maintained verification evidence.

Files changed:

- `pages/api/execute/code.ts`, `scripts/test-execute-provider.ts`,
  `scripts/test-review-mutations.mjs`, `scripts/check-baseline.sh`, project
  guidance, and the pre-aborted capacity plans.

Validation:

- Red phase: without the guard, the connected provider request failed with
  `connected request did not reach upstream; status 429`.
- Green focused checks: `npm run test:provider` and `npm run test:parser`.
- `make check` passed on Node.js 20.20.2, 22.16.0, and 24.17.0, including the
  production build, live HTTP test, seven hostile mutations, and zero-vulnerability audit.
- External Make passed from `/tmp` on Node.js 24.17.0. Hosted checks and
  exact-head review are pending.

Bugs and findings:

- Ten valid requests carrying an existing aborted signal could exhaust the
  per-process minute budget even though no response could be delivered.

Blockers:

- None for local implementation; hosted verification awaits the pull request.

Next action:

- Push the focused pull request, then verify hosted checks and the exact PR head
  before merge.

## 2026-06-25

- Refreshed compatible CodeMirror command/language patches and OpenAI 6.45.0,
  including the reviewed CodeMirror state 6.7.0 resolution, while preserving
  the full Node 20/22/24 build, route, provider, mutation, and audit gates.
- Added canonical, data-driven topic routes for all 28 documentation sidebar links, with dependency-free route and hostile-mutation coverage.
- Revalidated static generation, route-specific 404 behavior, built HTTP coverage,
  and the shared sidebar declaration with an independent Codex review.

## 2026-06-19

- Added fail-closed bearer authentication and a non-persistent editor token field
  for the spend-capable execute route.
- Rejected parameterized duplicate Content-Type values and format-control-only
  chat messages before provider admission.
- Aborted in-flight OpenAI requests when the client connection closes and added
  focused provider plus built-server live HTTP regressions.

## 2026-06-18

- Refreshed four compatible direct dependencies while preserving Node 20,
  TypeScript 5.9, patched esbuild, editor language behavior, and the complete
  webpack production gate.

## 2026-06-15

- Aligned the executable docs editor with the CodeMirror JavaScript extension
  and enabled TypeScript-compatible parsing.
- Added Unicode whitespace and accepted-content preservation regressions for
  execute messages.
- Made explicitly empty model allowlists fail closed instead of restoring
  built-in defaults.
- Rejected whitespace-only OpenAI API keys before execute capacity consumption.

## 2026-06-14

- Added an exact-head docs-design integration verification matrix that
  separates portable checks from sanitized responsive browser, deployment,
  and provider evidence.
- Added a tested `Cache-Control: no-store` policy to every execute API response
  so code, model output, and route errors are not intentionally cached.

## 2026-06-13

- Moved execute capacity consumption after local validation and API-key checks
  so invalid requests cannot exhaust provider-eligible request slots.
- Rejected ambiguous multi-value Content-Type headers before execute request
  body normalization while preserving single JSON values with parameters.
- Added a process-local fixed-window execute budget that rejects excess
  provider-eligible attempts with `429` and `Retry-After` before provider setup.
- Bounded enabled OpenAI execute requests to 30 seconds and disabled automatic
  SDK retries so one interactive request has a predictable provider window.
- Added an immutable, executable request-options contract and baseline guard.
- Retained Dependabot's exact `esbuild 0.28.1` lockfile update and added a
  static contract preventing regression to the vulnerable resolution.

## 2026-06-12

- Made the docs workspace responsive by stacking the sidebar and intro/editor
  regions below 900 pixels while preserving the desktop navigation rail.
- Added scroll-safe top navigation, visible keyboard focus states, accessible
  language labels, and semantic keyed sidebar lists.
- Added desktop, mobile, and focused-control screenshot verification to the
  responsive docs plan.

## 2026-06-10

- Added an explicit, default-off `DOCS_EXECUTE_ENABLED=true` deployment gate
  before the spend-capable OpenAI proxy can run.
- Rooted all Make targets and pinned CI to Ubuntu 24.04.
- Added a GitHub Actions workflow that runs clean installs and `make check` on
  Node 20, 22, and 24 for pushes, pull requests, and manual dispatches.
- Pinned GitHub Actions by commit, restricted workflow permissions to read-only,
  disabled persisted checkout credentials, and bounded verification jobs to 15
  minutes.
- Updated Next, OpenAI, React, React DOM, React types, and CodeMirror lint while
  preserving the repository's explicit Webpack production build contract.
- Raised the dependency audit gate to include moderate-severity findings and
  extended the source baseline and docs to require the hosted CI path.

## 2026-06-09

- Rejected non-finite numeric execute parameters before proxying OpenAI chat
  completion requests.
- Required own execute request, parameter, and message fields before normalized
  values are read.
- Cleared ignored `.next` output before Webpack builds so repeated local checks
  do not reuse stale Next trace files.
- Preserved extracted prototype keys as own fields so execute API parameter and
  message allow-lists reject them.
- Restricted execute API request bodies to the `code` field before parsing
  submitted examples and exposed `make lint` for the source baseline guard.
- Restricted execute API chat message objects to `role` and `content` fields.
- Required JSON content types on execute API requests before validating or
  proxying submitted code.
- Constrained `OPENAI_ALLOWED_MODELS` so deployment configuration can only
  narrow the checked-in execute API model allow-list.
- Rejected whitespace-only message content in execute API parser validation and
  added a regression guard.

## 2026-06-08

- Added a root `make check` wrapper for the existing npm verification gate.
- Hardened the design prototype execute API with AST-only extraction, literal
  parameter validation, model allow-listing, bounded message content, runtime
  key checks, and generic provider failure responses.
- Fixed the editor request path to submit the current code string directly,
  render API errors, and avoid logging submitted prompts or responses.
- Pinned the Next/Babel/OpenAI tooling baseline and added parser, build, guard,
  and audit verification gates through `npm test`.
