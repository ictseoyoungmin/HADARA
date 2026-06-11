# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and rc.1 publish-deferred baseline. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline from T-0298. | Read |
| docs/TASK_BOARD.md | Task queue and new T-0299 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and required-reading registration. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and Phase 7 status. | Read |
| docs/TEST_STRATEGY.md | Docker validation baseline. | Read |
| docs/SCHEMAS.md | Schema fixture registration expectations. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON contract expectations for new report surfaces. | Read |
| docs/specs/0.3.0/ | Phase 7 command/docs/managed/cleanup/release hardening context. | Read |
| docs/specs/0.3.0/rc1/00_Protocol_Migration_for_0_3_Adoption.md | Source design for this task. | Created/Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `0.3.0-rc.1` remains unpublished during this capsule. | User instruction and T-0298 handoff. | README/package docs must distinguish source candidate from published rc.0. |
| Migration should be additive and bounded, not a broad rewrite. | Phase 7 managed docs and remediation patterns. | Existing user-authored project context could be corrupted if migration edits too widely. |
| Existing projects may be basic/standard/governed or ambiguous. | Init profile docs and profile doctor behavior. | Migration needs profile override and conservative detection. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Dry-run-first with before-hash execute. | Existing `protocol remediate`, `task upgrade-scaffold`, `docs patch`, and user scope. | `protocol migrate` execute requires reviewed `summary.beforeHash`. |
| No release mutation. | User instruction. | No npm publish, GitHub Release, tag push, Docker image, or external registry mutation in T-0299. |
| Use Docker validation. | `docs/TEST_STRATEGY.md`. | Host npm on `/mnt/f` is unreliable due symlink issues. |
