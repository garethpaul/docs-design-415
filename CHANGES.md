# Changes

## 2026-06-13

- Rejected ambiguous multi-value Content-Type headers before execute request
  body normalization while preserving single JSON values with parameters.
- Added a process-local fixed-window execute budget that rejects excess enabled
  POST attempts with `429` and `Retry-After` before parsing or provider setup.
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
