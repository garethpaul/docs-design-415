## Docs Design 415 Vision

This document explains the current state and direction of the project.
Project overview and developer docs: [`README.md`](README.md)

Docs Design 415 is a Next.js "Try Now Docs" design prototype. It expands the
docs onboarding surface with additional layout, sidebar, language, and call to
action components.

The repository is useful as a design-oriented sibling of the docs prototype,
with CodeMirror, Radix UI, Next.js, React, and OpenAI API integration
dependencies. Setup and scripts live in [`README.md`](README.md).

The goal is to keep the design exploration runnable while making docs UX,
editor behavior, and proxy/security assumptions explicit.

The current focus is:

Priority:

- Preserve the richer docs layout and component set on the default branch
- Keep `npm run dev`, `npm run build`, `npm run type-check`, and `npm test`
  meaningful
- Keep repeated Webpack builds free of stale `.next` trace state
- Keep GitHub Actions aligned with the local npm `make check` baseline
- Avoid committing API keys or proxy secrets
- Keep the spend-capable execute route disabled unless deployment explicitly
  enables it
- Keep visual changes tied to the docs onboarding purpose
- Keep the docs workspace readable on mobile and preserve visible keyboard
  focus across navigation and action controls

Current baseline:

- The execute API accepts only static `openai.chat.completions.create({ ... })`
  examples with JSON request bodies and bounded literal parameters.
- Execute API request bodies may only contain the submitted `code` string.
- Chat messages may only include `role` and `content` so metadata is not
  accepted and then silently dropped.
- Extracted literal objects preserve prototype keys as own fields before
  allow-list validation.
- Execute request, parameter, and message normalization requires own fields
  before reading accepted values.
- Numeric execute parameters must be finite values before range checks pass.
- Proxied requests require `OPENAI_API_KEY` and use `OPENAI_ALLOWED_MODELS`
  when maintainers need a narrower model allow-list. Environment configuration
  cannot expand beyond the checked-in default model set.
- `DOCS_EXECUTE_ENABLED=true` is required before provider requests can run;
  public deployments still need upstream authentication and rate limiting.
- Enabled provider calls use a 30-second timeout with SDK retries disabled.
- Keep a process-local execute request budget before parsing and provider setup;
  require shared upstream enforcement for public multi-instance deployments.
- The parser test toolchain retains patched `esbuild 0.28.1` in the lockfile.
- The editor sends the current code string directly and avoids logging prompt
  content, parsed parameters, or provider responses.
- The execute API rejects whitespace-only message content before proxying.

Next priorities:

- Expand execute API tests when the accepted request shape grows
- Add docs route behavior checks if the design flow becomes production-facing
- Clarify component ownership between layout, sidebar, editor, and CTAs
- Keep framework dependency versions pinned or intentionally managed

Contribution rules:

- One PR = one focused docs UX, component, API proxy, or tooling change.
- Run `npm test` before pushing code changes.
- Update screenshots or README notes when the visible docs flow changes.
- Keep secrets in environment configuration.
- Keep `.github/workflows/check.yml` in sync with the local npm verification
  gate.

## Security

Canonical security policy and reporting:

- [`SECURITY.md`](SECURITY.md)

API proxying can expose credentials and user prompts. Do not commit OpenAI keys,
session secrets, or upstream API tokens.

Proxy routes should validate inputs, constrain destinations, and avoid logging
sensitive request content.

## What We Will Not Merge (For Now)

- Committed API keys or proxy credentials
- Open proxy behavior without validation
- Large visual rewrites disconnected from docs onboarding
- Dependency updates that skip build and type-check verification

This list is a roadmap guardrail, not a permanent rule.
Strong user demand and strong technical rationale can change it.
