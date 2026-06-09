---
title: Docs Design Message Field Allowlist
type: security
status: completed
date: 2026-06-09
---

# Docs Design Message Field Allowlist

## Problem Frame

The execute API already rejected unknown top-level chat completion parameters
and blank message content, but message objects with extra fields were accepted
and normalized down to `role` and `content`. Rejecting extra message fields
makes the accepted proxy request shape explicit.

## Scope Boundaries

- Preserve accepted `system`, `user`, and `assistant` messages.
- Preserve message count, message length, and whitespace-only content guards.
- Do not add support for tool calls, names, multimodal content, or streaming.
- Keep the parser regression as the executable contract.

## Implementation Units

### U1: Restrict Message Fields

Files:

- Modify `pages/api/execute/code.ts`

Approach:

- Add an allow-list for message object fields.
- Reject messages containing anything other than `role` and `content`.

### U2: Guard The Contract

Files:

- Modify `scripts/test-execute-parser.ts`
- Modify `scripts/check-baseline.sh`

Approach:

- Add a parser regression with an extra `name` field.
- Require the message field allow-list and regression test in the source guard.

### U3: Document The Baseline

Files:

- Modify `README.md`
- Modify `VISION.md`
- Modify `CHANGES.md`

Approach:

- Record that accepted chat messages are limited to `role` and `content`.
- Keep future request-shape expansion explicit and test-backed.

## Verification

- `npm run test:parser`
- `scripts/check-baseline.sh`
- `make check`
- `git diff --check`
