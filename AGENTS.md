# AGENTS.md

## Repository purpose

`garethpaul/docs-design-415` is a Next.js documentation-design prototype with an interactive OpenAI chat-completions example and a guarded server-side execute proxy.

## Project structure

- `Makefile` - repository verification targets
- `scripts` - baseline checks and helper scripts
- `docs` - plans, notes, and generated README assets
- `package.json` - Node package metadata and scripts
- `components` - repository source or sample assets
- `pages` - repository source or sample assets
- `public` - repository source or sample assets

## Development commands

- Install dependencies: `npm ci`
- Full baseline: `make check`
- Combined verification: `make verify`
- Lint/static checks: `make lint`
- Tests: `make test`
- Build: `make build`
- package script `dev`: `npm run dev`
- package script `start`: `npm start`
- package script `build`: `npm run build`
- package script `type-check`: `npm run type-check`
- package script `test`: `npm test`
- package script `check`: `npm run check`
- package script `audit`: `npm run audit`
- If a command above skips because a platform toolchain is missing, verify on a machine with that SDK before claiming platform behavior is tested.

## Coding conventions

- Language mix noted in the README: React TSX (9), TypeScript (1).
- Use Node >=20.9.0 for package scripts.
- Preserve the split documentation/editor layout and verify visible component changes in a browser when possible.
- Keep the executable sample on the CodeMirror JavaScript extension with TypeScript parsing enabled; its source is parsed as JavaScript/TypeScript by the execute API.
- Next.js routes, pages, and API handlers should stay aligned with the existing app structure.

## Testing guidance

- Test-related files detected: `scripts/test-execute-parser.ts`
- Start with the narrowest relevant test or Make target, then run `make check` before handing off if the change is not documentation-only.
- Keep README verification notes in sync when commands, fixtures, or supported toolchains change.

## PR / change guidance

- Keep diffs focused on the requested repository and avoid unrelated modernization or formatting churn.
- Preserve public APIs, sample behavior, file formats, and documented environment variables unless the task explicitly changes them.
- Update tests, README notes, or docs/plans when behavior, security posture, or validation commands change.
- Call out skipped platform validation, legacy toolchain assumptions, and any risky files touched in the final summary.

## Safety and gotchas

- Detected references to OpenAI. Keep API keys, OAuth credentials, tokens, and account-specific values in local configuration only.
- `OPENAI_API_KEY` must be provided through the environment. Do not commit OpenAI keys or sample outputs containing private prompt data.
- `EXECUTE_API_TOKEN` must remain server-only. The editor accepts it only in a
  non-persistent password field and sends it as a bearer token; never move it to
  `NEXT_PUBLIC_*`, browser storage, screenshots, or logs.
- The spend-capable execute route must remain disabled by default. `DOCS_EXECUTE_ENABLED` must normalize to exactly `true` before requests are proxied; this interlock does not replace authentication or rate limiting for public deployments.
- Preserve the process-local budget so only provider-eligible requests consume capacity
  after local validation and before provider setup; do not describe it as distributed multi-instance enforcement.
- Preserve `Cache-Control: no-store` on every execute API response so submitted
  code, provider output, and errors are not intentionally cached.
- Preserve client-disconnect cancellation so abandoned requests stop upstream
  provider work instead of consuming the full timeout window.
- `OPENAI_ALLOWED_MODELS` can narrow the comma-separated chat model allow-list. It can only narrow the checked-in default model allow-list; unsupported values are not allowed to expand the proxy. When unset, the execute API only accepts the checked-in defaults.
- Submitted chat messages are normalized to `role` and `content` only; message metadata fields are rejected instead of silently dropped.
- Execute API request bodies are limited to the `code` field; extra fields such as credentials or metadata are rejected before code parsing.
- Extracted parameter and message objects preserve prototype-pollution keys as own fields so the allow-lists reject them.

## Agent workflow

1. Inspect the README, Makefile, manifests, and the files directly related to the request.
2. Make the smallest source or docs change that satisfies the task; avoid generated, vendored, or local-environment files unless required.
3. Run the narrowest useful validation first, then `make check` or the documented package/platform gate when available.
4. If a required SDK, service credential, or external runtime is unavailable, record the skipped command and why.
5. Summarize changed files, commands run, and remaining risks or follow-up validation.
