---
title: docs-design-415 Check Wrapper
date: 2026-06-08
status: completed
execution: code
---

## Context

The design prototype already exposes `npm test` as the full local gate, but
repository automation expects a root `make check` command.

## Goals

- Add a root Makefile with focused type-check, parser, build, audit, test,
  verify, and check targets.
- Make `make check` run the same complete gate as `npm test`.
- Document the wrapper in README and CHANGES.
- Preserve the wrapper through the source baseline guard.

## Verification

- `make check`
- `npm test`
- `git diff --check`
