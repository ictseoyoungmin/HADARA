# Getting Started and Init Reference Separation

## Problem

Getting Started and Init both explained the same preset table, interactive setup, automation plan hash, generated files, and recovery details. This made the first-run path longer than necessary and left the Init page without a distinct reference boundary.

Public prose also exposed `init upgrade` repair details that were not needed for the ordinary setup journey.

## Resolution

### Getting Started

Owns the shortest first-run journey:

1. install HADARA;
2. run plain interactive `hadara init`;
3. understand the generated core project files;
4. move directly to After init and describe work to the coding agent.

It no longer contains preset commands, plan-hash automation, adoption, or upgrade-repair guidance.

### Init Reference

The former `Init (human setup)` page is now `Init Reference`. It owns only the non-default setup decisions:

- choosing `minimal`, `standard`, or `governed` initial document scope;
- JSON/non-interactive reviewed execution with a plan hash;
- adopting HADARA into an existing repository and responding to conflicts.

### Limits and Recovery

The already-initialized no-op case now routes damaged managed state to current diagnostic recovery guidance without naming an upgrade command or suggesting manual canonical JSON edits.

## Validation

- `npm test` in `docs/site`: passed
- `npm run build` in `docs/site`: passed
- Content regression enforces Getting Started section order and excludes preset, plan-hash, adopt, and upgrade detail from that page.
- Content regression requires preset, plan-hash, and adopt detail in Init Reference.
- No public documentation body contains `hadara init upgrade`.

T-0790 remains open for human visual review.
