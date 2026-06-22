# Documentation Sidebar Routes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Make every declared documentation sidebar link resolve to a meaningful, canonical topic page.

**Architecture:** Move the sidebar declaration into shared JSON data with unique section and topic slugs plus concise topic summaries. Render all topics through one static Next.js dynamic route, and make the sidebar consume the same data so navigation and route generation cannot drift independently.

**Tech Stack:** Next.js Pages Router, React, TypeScript, JSON, dependency-free Node.js contract tests.

## Status: Completed

---

### Task 1: Capture the broken navigation contract

**Files:**
- Create: `scripts/test-doc-routes.mjs`
- Modify: `package.json`

1. Enumerate all 28 current sidebar entries.
2. Assert that destinations are canonical, unique, and implemented.
3. Run the contract against the exact parent and record the expected 28 missing destinations and duplicate introduction slug.

### Task 2: Define shared topic data

**Files:**
- Create: `components/docs-content.json`
- Modify: `components/Sidebar.tsx`

1. Give each sidebar section a stable slug.
2. Give all 28 topics stable slugs and meaningful summaries.
3. Generate sidebar destinations from the shared declaration.

### Task 3: Render topic routes

**Files:**
- Create: `pages/docs/[section]/[slug].tsx`
- Modify: `pages/DocsPage.module.css`

1. Generate exactly the declared static paths.
2. Return `notFound` for unknown section/topic combinations.
3. Render the shared sidebar, topic heading, section label, summary, and a link back to the playground.

### Task 4: Exercise built route behavior

**Files:**
- Modify: `scripts/test-execute-http.mjs`
- Modify: `scripts/check-baseline.sh`

1. Request every canonical topic route from the built app.
2. Assert old aliases, case variants, and unknown slugs return 404.
3. Assert trailing-slash requests canonicalize to the declared route.

### Task 5: Validate adversarially

**Files:**
- Create: `scripts/test-doc-route-mutations.mjs`
- Modify: `package.json`

1. Mutate removed routes, duplicate normalized slugs, mismatched hrefs, empty placeholder content, aliases, case, and trailing slashes.
2. Confirm the dependency-free verifier rejects each mutation.
3. Run safe local checks and record dependency-required hosted gaps.
