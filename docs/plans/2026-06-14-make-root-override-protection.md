---
title: Make Repository Root Override Protection
type: reliability
status: completed
date: 2026-06-14
---

# Make Repository Root Override Protection

## Status: Completed

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

## Work Completed

- Protected the repository-derived Make root with GNU Make's `override`
  directive while preserving `NPM` as a caller-selected executable.
- Updated the existing six-reference root contract and registered this plan in
  the deterministic checker.
- Preserved the clean Next.js build and every application and package behavior.

## Verification Completed

- `sh -n scripts/check-baseline.sh` and the focused package check passed.
- `make check` passed from the repository and an external working directory.
- Full checks passed with command-line and environment `ROOT=/tmp`
  assignments while commands continued to use the checkout.
- Type-check, parser tests, clean production build, static checks, and
  `npm audit --audit-level=moderate` passed with zero vulnerabilities.
- Three isolated hostile assignment mutations were rejected: a regular
  assignment, a conditional assignment, and a caller-directory assignment.
