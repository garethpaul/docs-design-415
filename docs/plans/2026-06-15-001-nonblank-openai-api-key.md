# Nonblank OpenAI API Key Boundary

status: planned

## Problem

The docs-design execute route checks `OPENAI_API_KEY` only for truthiness. A
whitespace-only environment value therefore passes local configuration
validation, consumes process-local capacity, and reaches provider construction
before failing as a generic upstream error.

## Requirements

1. Treat absent, non-string, empty, and whitespace-only API keys as missing.
2. Return the existing 503 configuration error before rate-limit capacity or
   provider setup is reached.
3. Pass the trimmed key to the OpenAI client for valid configuration.
4. Preserve request validation order, no-store responses, rate limits,
   timeout/retry settings, provider parameters, and enable-gate behavior.
5. Add mutation-sensitive handler, source, documentation, and completed-plan
   contracts.

## Scope Boundaries

- Do not add authentication, distributed rate limiting, secret storage, key
  format validation, provider calls, UI changes, or dependency changes.
- Do not log, expose, persist, or commit any credential value.
- Do not claim responsive-browser, deployed-route, edge, or live OpenAI
  execution.
- Do not merge or close stacked pull requests without explicit authorization.

## Implementation

1. Add a small exported helper that returns a trimmed nonblank key or `null`.
2. Resolve the key after request/parser validation and before capacity
   consumption, then pass the normalized value to the OpenAI client.
3. Add isolated helper and handler regression coverage for whitespace-only
   configuration while retaining no-store assertions.
4. Extend the static baseline and repository guidance contracts.
5. Run focused tests, hostile mutations, supported Node package gates from the
   repository and an external working directory, and final audits.

## Verification

Pending implementation and bounded validation.
