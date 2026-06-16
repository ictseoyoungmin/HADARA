# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository protocol, task workflow, Docker validation preference, and release mutation boundaries. | Done |
| .hadara/context/HADARA_CONTEXT.md | Compact project-local routing context. | Done |
| docs/PROJECT_STATE.md | Current phase and next planned release-readiness line. | Done |
| docs/AGENT_HANDOFF.md | Current handoff, known release/package validation constraints, and next task recommendation. | Done |
| docs/TASK_BOARD.md | Task queue and T-0326 row. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow, documentation timing, status token policy, Docker validation path, and release write serialization. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit semantics and CloseState derived-state policy. | Done |
| docs/DEVELOPMENT_SLICES.md | Completed Phase 8 slices and the new release-readiness placement. | Done |
| docs/TEST_STRATEGY.md | Docker validation baseline, package smoke, and clean-checkout smoke expectations. | Done |
| docs/RELEASE_READINESS.md | Release target metadata, evidence flow, and no-mutation release gate contract. | Done |
| docs/RELEASE_NOTES.md | Existing release-note format and history. | Done |
| docs/SECURITY_MODEL.md | Secret/logging and mutation safety invariants. | Done |
| docs/ROADMAP.md | Phase 8/0.3.1 line and release/package boundaries. | Done |
| README.md | Package-facing release status and install guidance. | Done |
| scripts/release/manual-publish-rc.sh | Approval-gated publish helper that T-0327 will use. | Done |
| scripts/release/prepare-publish-env.sh | Operator helper for clean publish clone preparation. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0326 can prepare but must not publish `0.3.1-rc.1`. | User request and release readiness policy. | Accidentally mutating npm/GitHub/Docker/PyPI state would violate the capsule boundary. |
| A clean committed source checkpoint is needed before release artifact execution. | Release artifact dirty-worktree guard and T-0315 pattern. | Artifact generation can block with `RELEASE_ARTIFACT_WORKTREE_DIRTY` unless source prep is committed first. |
| T-0327 and T-0328 should remain separate tasks. | User request. | Mixing publish and post-publish recycle into T-0326 would blur evidence and mutation boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Use Docker as the primary validation path. | AGENTS, SOP, Test Strategy. | Host `/mnt/f` Node/npm is unreliable for full validation. |
| Do not load or write tokens. | Security Model and release docs. | T-0326 may run publish dry-run only; authenticated execute belongs to T-0327. |
| Keep release artifact, package smoke, clean-checkout smoke, and evidence writes serialized. | SOP write coordination. | These commands mutate local evidence/artifact state. |
