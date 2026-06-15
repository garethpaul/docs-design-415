---
title: Execute Message Whitespace Contract
type: testing
status: in_progress
date: 2026-06-15
execution: code
---

# Execute Message Whitespace Contract

## Problem Frame

The execute parser already rejects whitespace-only message content, but its
regression suite covers only ASCII whitespace and does not prove that accepted
nonblank content retains meaningful surrounding spacing. A refactor could
narrow the rejection set or trim accepted prompts without failing the current
gate.

## Prioritized Engineering Work

1. **P0 - Boundary verification:** cover JavaScript Unicode whitespace and
   byte-for-byte preservation for accepted content.
2. **P1 - Provider integration evidence:** execute the sanitized route/provider
   matrix in an authorized deployment.
3. **P2 - Shared capacity enforcement:** replace process-local rate limiting
   for multi-instance deployment.

This change implements P0 only. P1 remains in `INTEGRATION_VERIFICATION.md`,
and P2 requires deployment architecture beyond this sample.

## Scope Boundaries

- Keep the existing `content.trim().length === 0` runtime behavior unchanged.
- Add direct coverage for empty, ASCII whitespace, non-breaking space, and
  byte-order-mark-only content.
- Prove accepted nonblank content with surrounding whitespace is not trimmed.
- Do not call OpenAI, change request normalization, or claim browser/deployment
  evidence.

## Requirements

- R1. The regression suite rejects representative ASCII and Unicode whitespace.
- R2. The regression suite preserves accepted content exactly.
- R3. Static contracts fail when the runtime guard or either regression class
  is removed.
- R4. Guidance and completed-plan evidence describe the verified boundary.

## Implementation Units

### U1: Strengthen Parser Regressions

Files:

- `scripts/test-execute-parser.ts`

Approach:

- Exercise `normalizeChatRequest` with representative blank content values.
- Assert the normalized request retains an accepted message's original content.

### U2: Preserve Verification Evidence

Files:

- `scripts/check-baseline.sh`
- `CHANGES.md`
- `README.md`
- `SECURITY.md`
- `VISION.md`
- `docs/plans/2026-06-15-message-whitespace-contract.md`

Approach:

- Require runtime, rejection, preservation, guidance, and completed-plan
  markers in the existing package gate.

## Verification

- Focused execute parser tests.
- Repository and external-directory `make check`.
- Hostile mutations for runtime guard, Unicode regression, preservation
  regression, documentation, and completion evidence removal.
- Exact diff, generated artifact, conflict marker, and credential audits.

## Risks

- The tests intentionally follow JavaScript `String.prototype.trim()` Unicode
  semantics rather than defining a separate whitespace table.

## Status: In Progress
