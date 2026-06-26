# Pre-Aborted Execute Capacity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Prevent already-disconnected execute requests from consuming process-local provider capacity.

**Architecture:** Keep the current authentication, parser, provider, and in-flight cancellation design. Add one early disconnect boundary after local/provider configuration validation and before fixed-window admission, with the real provider harness proving capacity remains available.

**Tech Stack:** Next.js API routes, TypeScript, Node.js, OpenAI SDK, local HTTP test server, npm.

---

status: completed

### Task 1: Prove abandoned capacity consumption

**Files:**
- Modify: `scripts/test-execute-provider.ts`

1. Extract a request factory for valid execute requests.
2. Invoke the handler ten times with `aborted: true` and assert no response body.
3. Invoke one connected request and require the local upstream to start.
4. Run `npm run test:provider` and verify the connected request is rate-limited before the fix.

### Task 2: Reject pre-aborted requests before admission

**Files:**
- Modify: `pages/api/execute/code.ts`

1. Return without a response when `req.aborted` is already true after API-key validation.
2. Keep fixed-window admission immediately before abort-listener/provider setup.
3. Rerun provider and parser tests.

### Task 3: Preserve maintained contracts

**Files:**
- Modify: `scripts/test-review-mutations.mjs`
- Modify: `scripts/check-baseline.sh`
- Modify: `README.md`
- Modify: `SECURITY.md`
- Modify: `VISION.md`
- Modify: `AGENTS.md`
- Modify: `CHANGES.md`

1. Add a hostile mutation that removes the pre-aborted guard.
2. Require source, provider-test, plans, and guidance fragments.
3. Record red/green, full-gate, hosted, and review evidence.

### Task 4: Validate and merge

**Files:**
- Verify only.

1. Run focused tests, `make check`, external Make, and clean generated-output checks.
2. Push a focused PR and attempt Codex review.
3. Merge only the exact final head after hosted checks and Vercel pass.

## Verification Completed

- Red: removing the early disconnect guard caused the connected request to fail
  with `connected request did not reach upstream; status 429`.
- Green: `npm run test:provider` and `npm run test:parser` pass.
- `npm run test:mutations` rejects all seven hostile mutations.
- `make check` passes on Node.js 20.20.2, 22.16.0, and 24.17.0; external Make
  passes from `/tmp` on Node.js 24.17.0.
- Implementation head `50a70ec45e39ecd93445ca8cd14d888584a72a93` passes both
  hosted Node 20/22/24 matrices (`28245437588`, `28245440551`), CodeQL
  (`28245438551`), and Vercel.
- `codex review --base origin/docs-page` was attempted and skipped after HTTP
  401 authentication errors.
- Pending: evidence-only final-head hosted checks and merge verification.
