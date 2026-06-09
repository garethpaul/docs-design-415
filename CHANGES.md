# Changes

## 2026-06-09

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
