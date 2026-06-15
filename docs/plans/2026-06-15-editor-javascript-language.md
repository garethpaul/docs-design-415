---
title: Editor JavaScript Language Alignment
type: fix
status: planned
date: 2026-06-15
---

# Editor JavaScript Language Alignment

## Problem

The primary docs editor contains a JavaScript OpenAI example and sends that
source to a JavaScript/TypeScript AST parser, but CodeMirror is configured with
the Python language extension. The visible editor therefore parses and
highlights the executable sample using the wrong language grammar.

## Priorities

1. P0: Configure CodeMirror for JavaScript syntax with TypeScript-compatible
   parsing.
2. P1: Replace the unused Python language package with the current JavaScript
   language package and keep the lockfile reproducible.
3. P2: Protect the editor, manifest, lockfile, guidance, and completed-plan
   alignment against regression.

## Requirements

- Use `@codemirror/lang-javascript` for the executable editor sample.
- Configure the extension for JavaScript with TypeScript syntax support.
- Remove the direct `@codemirror/lang-python` dependency.
- Preserve the default sample, execute request, editor state, and UI behavior.
- Add mutation-sensitive source, package, lockfile, guidance, and plan contracts.
- Verify the rendered `/docs` editor when browser tooling is available.

## Implementation Units

### U1: Editor Language Configuration

**File:** `components/Editor.tsx`

Replace the Python language import and extension with the JavaScript extension
configured for TypeScript-compatible parsing. Keep the executable sample and
request path unchanged.

### U2: Dependency Graph Alignment

**Files:** `package.json`, `package-lock.json`

Replace the direct Python language dependency with
`@codemirror/lang-javascript` 6.2.5 and regenerate the frozen npm lockfile.

### U3: Portable Contracts And Guidance

**Files:** `scripts/check-baseline.sh`, `AGENTS.md`, `README.md`, `VISION.md`,
`CHANGES.md`, and this plan.

Require matching editor source, manifest, lockfile, maintained guidance, and
completed verification evidence.

## Verification

- Run TypeScript, parser tests, production build, baseline contracts, and npm
  audit from repository and external directories.
- Reject isolated import, extension, manifest, lockfile, guidance, and
  incomplete-plan mutations.
- Inspect `/docs` using the pipeline browser workflow when available.
- Audit the exact diff, generated artifacts, dependency/workflow drift outside
  the intended package pair, conflict markers, whitespace, and credential-shaped
  additions.

## Completion Evidence

- Pending implementation and verification.

## Scope Boundaries

- Do not change editor content, execute API behavior, response handling,
  styling, layout, or other dependencies.
- Keep this pull request stacked on PR #14 and preserve base-first ordering.
