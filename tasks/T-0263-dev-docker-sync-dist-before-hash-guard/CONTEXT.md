# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and Phase 6.1 carry-forward order. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker development workflow. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle and Phase 6 command semantics. | Read |
| docs/specs/agent-ux/HADARA_Phase6_1_Reviewer_Feedback_Hardening_Spec.md | T-0263 acceptance and release-blocker context. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Workspace `dist/cli/main.js` is the reviewed output artifact for `--sync-dist` freshness. | Existing T-0261 distSync metadata and dev Docker wrapper implementation. | A broader dist tree hash could catch more stale outputs, but the existing report already exposes this file as the primary before/after hash. |
| First-time sync without a pre-existing dist hash should be rare and explicitly operator-selected. | Phase 6.1 reviewer feedback and spec. | Requiring the escape hatch may add friction for fresh checkouts, but avoids silently treating missing pre-sync state as reviewed. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No project source mutation from `dev docker-check`. | T-0261 mutation vocabulary. | `projectMutation:false` and `projectSourceMutation:false` remain compatibility/source fields. |
| Workspace output mutation only when sync is explicit and freshness guard passes. | T-0263 scope. | `outputMutation` follows actual `distSyncExecuted`. |
| JSON output must remain path/log redacted. | Existing `hadara.dev.docker_check.v1` contract. | Guard issues expose hashes and issue codes, not raw Docker/npm logs. |
