# T-0521 command portfolio reduction inventory

## Identity

| Field | Value |
|---|---|
| ID | T-0521 |
| Title | command portfolio reduction inventory |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Inventory the full HADARA command portfolio and classify reduction candidates before 0.5.x work. | This capsule produces a structured command table and reduction plan only; implementation/removal happens in follow-up capsules. |

## Scope

| Boundary | Items |
|---|---|
| In | All current `hadara commands --json` registry entries, family/requiredness distribution, importance tiers, keep/merge/deprecate/internalize recommendations, and first follow-up cut lines. |
| Out | Code removal, registry mutation, redirect-stub implementation, release packaging, and command behavior changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Extract current command registry count and metadata from built/source registry. | Done |
| 2 | Write `COMMAND_PORTFOLIO.md` with all commands and reduction recommendations. | Done |
| 3 | Record evidence, update handoff/state docs, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Every current command registry entry is represented in the inventory. | Done | ev:T-0521:87352953be5d4b8c8bf5e13c | `COMMAND_PORTFOLIO.md` |
| AC-2 | The inventory includes importance, default-help exposure, and keep/merge/deprecate/internalize recommendations. | Done | ev:T-0521:87352953be5d4b8c8bf5e13c | `COMMAND_PORTFOLIO.md` |
| AC-3 | Follow-up implementation slices are explicitly separated from this analysis capsule. | Done | ev:T-0521:87352953be5d4b8c8bf5e13c | `COMMAND_PORTFOLIO.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `node dist/cli/main.js commands --json` | Yes | Passed | ev:T-0521:87352953be5d4b8c8bf5e13c |
| `node --input-type=module -e "import('./dist/services/capability-registry.js')..."` | Yes | Passed | ev:T-0521:87352953be5d4b8c8bf5e13c |
| Manual review of `COMMAND_PORTFOLIO.md` | Yes | Passed | ev:T-0521:87352953be5d4b8c8bf5e13c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `src/services/capability-registry.ts` | reference | active | Authoritative command registry source. |
| `docs/COMMAND_SURFACE.md` | reference | active | Command family, requiredness, write boundary, and removed surface policy. |
| Fable 5 review | reference | active | External review identified command surface size as the highest-leverage structural concern. |
| `docs/AGENT_HANDOFF.md` | reference | active | Current release line is complete through stable 0.4.1, so command portfolio work can start cleanly. |

## Changes

| Area | Summary |
|---|---|
| Analysis | Added command portfolio inventory and reduction plan for all 73 current commands. |
| Release Planning | Identified merge/deprecate/internalize candidates for pre-0.5.x command surface reduction. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Implement the first command-surface reduction slice: merge/remove lowest-risk read-model duplicates with redirect stubs where needed. | Open | `COMMAND_PORTFOLIO.md` |
| RF-2 | Follow-up | Revisit release service command consolidation the next time release code changes. | Open | `COMMAND_PORTFOLIO.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | Command portfolio inventory and reduction recommendations completed. |
