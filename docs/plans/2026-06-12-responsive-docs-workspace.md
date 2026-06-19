---
title: Responsive Docs Workspace
type: fix
status: completed
date: 2026-06-12
---

# Responsive Docs Workspace

## Summary

Preserve the prototype's existing desktop docs composition while making the
navigation, sidebar, intro/editor split, CTA, and language controls usable on
narrow viewports and visible during keyboard navigation.

## Problem Frame

The `/docs` route fixes the sidebar at 250 pixels and keeps the intro/editor
area in two 50-percent columns at every viewport width. At 390 pixels, the
remaining content collapses into a narrow strip and the top navigation clips.
Several button and link styles also remove focus outlines without replacing
them, leaving keyboard users without a visible location.

## Design Direction

- **Visual thesis:** retain the Colfax typography, white canvas, soft-gray docs
  navigation, dark editor, and OpenAI-green actions already present.
- **Content plan:** preserve navigation, sidebar taxonomy, intro/CTA, editor,
  and language controls in their current reading order.
- **Interaction plan:** add consistent focus-visible rings and horizontal nav
  scrolling; stack the docs workspace at narrow widths without decorative
  motion or new UI concepts.

## Requirements

- R1. The desktop docs route must retain a 250-pixel sidebar and split
  intro/editor workspace.
- R2. At 900 pixels and below, the sidebar must become full-width and the
  intro/editor workspace must stack into one column.
- R3. At mobile widths, the top navigation must remain available without
  overlapping page content.
- R4. Sidebar links, search, CTA, and language buttons must expose visible
  `:focus-visible` states.
- R5. Language icon buttons must have accessible labels.
- R6. The sidebar section map must render without React key warnings.
- R7. The source baseline, README, VISION, and CHANGES must preserve the
  responsive and keyboard-accessible contract.

## Non-Goals

- Rewriting docs content or navigation destinations.
- Adding a mobile drawer, search implementation, or new component library.
- Restyling the editor theme or execute API behavior.
- Replacing the current brand assets or typography.

## Work Completed

- Added a dedicated docs-page grid that preserves the desktop 250-pixel rail
  and becomes a single-column workspace below 900 pixels.
- Made the shared split component stack and constrained the mobile sidebar to a
  scrollable navigation region.
- Made the top navigation horizontally scrollable instead of allowing overlap.
- Added visible focus states, accessible language labels, button types, and
  semantic keyed sidebar list items.
- Extended the static baseline and project documentation with the responsive
  and keyboard-accessibility contract.

## Verification

- Node 20.19.5, 22.22.2, and 24.16.0: clean `npm ci` followed by `make check`
  passed TypeScript, parser tests, the Next.js production build, the source
  baseline, and `npm audit` with zero vulnerabilities.
- Chrome for Testing 148 desktop screenshot at 1440x1000 preserves the
  250-pixel rail, split intro/editor workspace, and hydrated CodeMirror editor.
- Mobile screenshot at 390x844 shows a bounded sidebar, stacked editor, readable
  content, and a document width equal to the 390-pixel viewport.
- Focus-state screenshot confirms the CTA has a distinct solid 3-pixel outline.
- Six isolated hostile mutations were rejected: removing the mobile stack,
  removing CTA focus visibility, removing a language label, restoring checkout
  credentials, adding write permissions, and marking this plan incomplete.
- `git diff --check` passes.
