# CI Baseline

Status: Completed

## Context

The repository had a local npm-backed `make check` verification gate, but no
hosted workflow installed dependencies and ran it for pushes and pull requests.
Its application dependencies also lagged the maintained Next, OpenAI, React,
and CodeMirror releases used by the project.

## Changes

- Added a GitHub Actions workflow that runs `npm ci` and `make check` on Node
  20, 22, and 24 for pushes, pull requests, and manual dispatches.
- Pinned third-party actions by commit, granted read-only repository access,
  enabled stale-run cancellation, and limited jobs to 15 minutes.
- Updated Next, OpenAI, React, React DOM, React types, and CodeMirror lint while
  preserving the explicit Webpack production build.
- Extended the source baseline and docs so the hosted CI and dependency
  contracts stay covered, including the moderate-severity audit gate.

## Verification

- Clean `npm ci` and `make check` runs on Node 20, 22, and 24
- `npm outdated --json`
- `git diff --check`
