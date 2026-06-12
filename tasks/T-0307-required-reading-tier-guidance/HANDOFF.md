# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0307 |
| Status | Done |
| Last Updated | 2026-06-12 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Required-reading tier guidance added to root docs. | `AGENTS.md`, SOP, and workflow docs now define `current-state`, `task-work`, `conditional-reference`, `historical`, and `excluded`. |
| Generated scaffold guidance updated. | `src/cli/init.ts` emits the same tier model in generated docs. |
| Validation passed. | Docker focused tests, Docker build/dist refresh, built init smoke, and `git diff --check` passed; evidence `ev:T-0307:e734ee5805dd4a63a0fb1e73`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0308 Required Reading Command Output Tiering. | T-0307 deliberately did not change `docs required-reading --json`; T-0308 owns machine-readable tier metadata. | `docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| T-0308 should change command output/schema, not repeat guidance-only edits. | Keeps capsule boundaries clear. | Start from docs registry and required-reading command surfaces. |
