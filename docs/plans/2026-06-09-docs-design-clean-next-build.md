# Docs Design Clean Next Build

Status: Completed
Date: 2026-06-09

## Goal

Keep repeated local `npm run build`, `npm test`, and Make verification runs from
failing on stale ignored `.next` build trace files.

## Changes

- Updated `npm run build` to remove `.next` before invoking the stable Webpack
  Next build.
- Extended the source baseline to require the cache cleanup and Webpack build
  command.
- Documented the repeatable build behavior in README, CHANGES, VISION, and this
  completed plan.

## Verification

- `sh -n scripts/check-baseline.sh`
- `scripts/check-baseline.sh`
- `npm run build`
- `npm test`
- `make build`
- `make check`
- `git diff --check`
