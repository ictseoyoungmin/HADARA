# HADARA Task Next Handoff Priority Refactor

| Field | Value |
|---|---|
| Status | Active for T-0239 |
| Scope | `hadara task next --json` recommendation policy |
| Owner Capsule | T-0239 Task Next Handoff Priority |
| Date | 2026-06-04 |

## Problem

`hadara task next --json` currently treats the first incomplete Task Board row as the fallback primary recommendation when Development Slices contain no open planned row. In HADARA-dev this points at old `Partial` backlog work such as T-0006, even when `docs/AGENT_HANDOFF.md` and `docs/PROJECT_STATE.md` explicitly identify a current roadmap direction.

That makes the command unreliable as a session entry point. Operators must manually override the CLI by rereading handoff state, which weakens the protocol loop.

## Goal

Make `task next` prioritize the current operator handoff when it names a next work direction that does not already map to an unfinished concrete Task Capsule.

## Recommendation Policy

| Priority | Source | When Used | Output Source |
|---|---|---|---|
| 1 | `docs/AGENT_HANDOFF.md` `Next Recommended Step` / `Active / Next Task` | Handoff names a current next direction and no concrete open Development Slice should supersede it. | `docs/AGENT_HANDOFF.md` |
| 2 | `docs/DEVELOPMENT_SLICES.md` | A planned/active/draft/pending/blocked row names a concrete future Task ID. | `docs/DEVELOPMENT_SLICES.md` |
| 3 | `docs/TASK_BOARD.md` backlog fallback | No current handoff or planned slice recommendation exists. | `docs/TASK_BOARD.md` |

Task Board rows with status `Partial` should be visible as backlog/fallback, but they should not override a fresh handoff recommendation.

## Report Shape

`hadara.task.next.v1` remains additive. The report should keep existing fields and add enough metadata for consumers to distinguish current recommendations from legacy backlog.

| Field | Purpose |
|---|---|
| `summary.source` | Primary recommendation source. |
| `summary.policy` | Machine-readable policy id, for example `handoff-first`. |
| `recommendations[].sourceKind` | `handoff`, `development-slices`, or `task-board-fallback`. |
| `recommendations[].taskId` | Concrete Task ID when known, otherwise a generated placeholder such as `TBD`. |
| `recommendations[].createCommand` | Present when the recommendation should create a new capsule. |
| `sources.agentHandoff.nextRecommendedStep` | Parsed next-step text used for handoff recommendations. |
| `backlog` | Optional non-primary legacy/open board rows, including old `Partial` rows. |

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Automatically creating Task Capsules. | `task next` must remain read-only. |
| Reclassifying old `Partial` Task Board rows. | That belongs in a separate remediation capsule. |
| Rewriting roadmap or handoff docs. | This capsule changes the recommendation read model only. |
| Removing Task Board fallback. | Smaller HADARA projects may rely on board-only workflows. |

## Acceptance

| ID | Criterion |
|---|---|
| AC-1 | In the current HADARA-dev workspace, `task next --json` does not make T-0006 the primary recommendation while handoff names current roadmap work. |
| AC-2 | The report exposes the primary recommendation source and policy. |
| AC-3 | Legacy Task Board fallback rows remain visible as non-primary backlog/fallback data. |
| AC-4 | Existing Development Slices and Task Board recommendation behavior remains available when handoff has no actionable next direction. |
