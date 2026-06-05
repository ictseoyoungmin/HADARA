# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and T-0268 release evidence baseline. | Done |
| docs/AGENT_HANDOFF.md | Current handoff and publish-gated next step. | Done |
| docs/TASK_BOARD.md | Task queue and T-0269 capsule row. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and release/doc required reading. | Done |
| docs/DEVELOPMENT_SLICES.md | Starting a new release slice. | Done |
| docs/TEST_STRATEGY.md | Release/package validation boundaries. | Done |
| docs/SECURITY_MODEL.md | Token and public evidence safety invariants. | Done |
| docs/ROADMAP.md | Release/packaging boundary and deferred targets. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Task workflow and close/evidence boundaries. | Done |
| docs/RELEASE_READINESS.md | Release target, token, artifact, and publish boundaries. | Done |
| docs/RELEASE_NOTES.md | Current release note state. | Done |
| README.md | Public install and workflow documentation. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0268 release evidence remains the latest committed readiness evidence. | T-0268 close/audit and release dry-run evidence. | README changes in T-0269 mean a real publish should first regenerate package/release artifact evidence after those changes are committed. |
| `docs/assets/` is the right repo-local documentation asset location. | Existing asset path and docs convention. | npm README image rendering needs either a committed remote raw URL or package whitelist changes to include the asset. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not print token values. | SECURITY_MODEL and RELEASE_READINESS. | Only token presence by name can be reported. |
| Do not execute publish without explicit approval. | User request and release docs. | Publish execute/manual publish path blocked in this session. |
| Do not commit. | User request. | Leave changes in the worktree for review. |
| README changes invalidate current package artifact freshness for real publish. | Release artifact evidence boundary. | Commit README/asset first, then rerun package smoke, clean-checkout, release artifact, dry-run, and publish dry-run before actual publish. |
