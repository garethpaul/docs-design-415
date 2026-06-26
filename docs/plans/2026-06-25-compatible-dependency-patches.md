# Refresh Compatible Dependency Patches

status: pending_hosted_verification

## Context

A bounded registry comparison found three newer releases within the current
major-version boundaries: @codemirror/commands 6.10.4,
@codemirror/language 6.12.4, and OpenAI 6.45.0. Their packaged changelogs record
selection-direction handling, linear folded-range construction, and OpenAI SDK
streaming, parsing, abort-listener, and token-validation fixes.

The commands patch raises its compatible state dependency to
@codemirror/state 6.7.0. TypeScript 6 and @types/node 26 remain deferred because
they cross compiler or supported-runtime type boundaries.

## Requirements

- Pin all three direct patches exactly and regenerate the npm lockfile through
  the structured resolver.
- Require exact versions, registry URLs, and integrity values for the three
  direct artifacts and @codemirror/state 6.7.0.
- Preserve Next 16.2.9, React 19.2.7, TypeScript 5.9.3, patched esbuild 0.28.1,
  execute-route behavior, docs routes, workflow pins, and audit policy.
- Keep the complete gate passing on Node 20, Node 22, and Node 24 without a
  live OpenAI provider request.

## Test-Driven Implementation

The baseline gate was changed first to require the three new direct versions.
The unchanged manifest then failed on the stale @codemirror/commands pin before
npm updated the manifest and reviewed lockfile graph.

## Validation

- Run a clean lockfile-pinned install with lifecycle scripts disabled.
- Run parser, provider, route, hostile-mutation, type-check, webpack build,
  built HTTP, source baseline, and moderate audit gates through `make check`.
- Repeat the full gate under Node 20, Node 22, and Node 24 from the repository
  root and an external working directory.
- Reject isolated dependency mutations covering direct pins, the lockfile root,
  reviewed artifact versions and integrity, plan status, and evidence.

## Scope Boundaries

- Do not update Babel 8, TypeScript 6, Node 26 types, Next, React, Radix,
  workflows, application source, execute authorization, or provider behavior.
- Do not add optional OpenAI AWS, Smithy, WebSocket, or Zod peers.
- Do not claim a live OpenAI request or deployed browser verification.

## Verification Results

Clean lockfile-pinned installs with lifecycle scripts disabled passed under Node
20.20.2, Node 22.16.0, and Node 24.17.0. On every runtime, repository-root and
external-directory `make check` passed all 28 docs-route contracts, route
mutations, TypeScript checks, parser and provider tests, six existing hostile
review mutations, the complete Next.js webpack build with 28 generated topic
pages, built HTTP tests, the source baseline, and the moderate audit with zero
vulnerabilities.

All twelve isolated dependency mutations were rejected for the intended reason
across direct pins, the root lockfile, reviewed direct and transitive artifact
versions and integrity, plan status, compatibility boundaries, and CHANGES.md
evidence.

Exact-head hosted checks remain pending.

## Sources

- npm package metadata and packaged changelogs for the three reviewed releases,
  inspected June 25, 2026.
