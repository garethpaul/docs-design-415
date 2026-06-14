---
title: Make Repository Root Override Protection
type: reliability
status: active
date: 2026-06-14
---

# Make Repository Root Override Protection

## Status: Active

## Problem Frame

The Makefile derives its checkout path in `ROOT`, but command-line assignments
override that value. `make ROOT=/tmp check` therefore directs NPM to an
untracked `/tmp/package.json` rather than the repository's pinned package gate.

## Scope Boundaries

- Preserve all Make targets and the existing clean Next.js build behavior.
- Preserve `NPM` as an intentional caller-selected executable override.
- Do not change UI, API, parser, rate-budget, dependency, or provider behavior.
- Keep Make commands independent of the caller's working directory.

## Requirements

- R1. Derive the repository root from the loaded Makefile itself.
- R2. Command-line and environment assignments must not redirect that root.
- R3. The deterministic checker must enforce the protected assignment form.
- R4. The pinned package gate must pass from repository and external paths.
- R5. Isolated mutations that restore caller control must fail verification.

## Implementation

1. Protect the Makefile repository-root assignment from caller overrides.
2. Register exact assignment and completed-plan contracts in the checker.
3. Run focused, full, external-directory, hostile-override, and mutation gates.

## Verification

- `sh -n scripts/check-baseline.sh`
- `make check`
- External-working-directory `make -C <repository> check`
- Hostile command-line and environment `ROOT` assignments
- Type-check, parser tests, clean production build, static checks, and audit
- `git diff --check`
- Isolated hostile assignment mutations
