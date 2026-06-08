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
- Keep `npm run dev`, `npm run build`, and `npm run type-check` meaningful
- Avoid committing API keys or proxy secrets
- Keep visual changes tied to the docs onboarding purpose

Next priorities:

- Document environment variables, proxy behavior, and default branch context
- Add checks around editor parsing and docs route behavior
- Clarify component ownership between layout, sidebar, editor, and CTAs
- Pin or intentionally manage framework dependency versions

Contribution rules:

- One PR = one focused docs UX, component, API proxy, or tooling change.
- Run `npm run type-check` and `npm run build` before pushing code changes.
- Update screenshots or README notes when the visible docs flow changes.
- Keep secrets in environment configuration.

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
