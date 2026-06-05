# Context

T-0260 is the final Phase 6 capsule from the local agent-UX spec. It must split the growing release dry-run implementation into smaller services before future provider expansion, while preserving `hadara.releaseDryRun.v1` compatibility.

Strict boundaries:

- Do not add release publish automation.
- Do not load token values.
- Do not create GitHub Releases.
- Do not build Docker images.
- Do not upload PyPI artifacts.
- Do not mutate registries or release artifacts.
- Keep npm as the effective primary target and Python advisory behavior non-blocking.

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | T-0260 scope and acceptance criteria. | Read |
| docs/CLI_JSON_CONTRACT.md | Release dry-run JSON compatibility boundary. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit workflow. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara.releaseDryRun.v1` consumers rely on the existing report shape. | Phase 6 T-0260 spec. | Accidental schema drift could break release operators. |
| Future provider expansion needs smaller release dry-run internals first. | Phase 6 T-0260 spec. | Keeping all helper logic in one file would make future provider work fragile. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve npm as effective primary. | Phase 6 T-0260 spec and release readiness docs. | No auto-promotion was added. |
| Preserve Python advisories as non-blocking preview metadata. | Phase 6 T-0260 spec and T-0250/T-0252 state. | Python evidence still cannot satisfy or block npm release readiness. |
| Preserve no-mutation release boundary. | AGENTS, release-readiness docs, and T-0260 spec. | No publish, token loading, GitHub Release creation, Docker build, PyPI upload, or registry mutation was added. |
