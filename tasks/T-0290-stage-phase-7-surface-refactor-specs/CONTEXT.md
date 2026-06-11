# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository-level HADARA protocol rules. | Read |
| docs/PROJECT_STATE.md | Current project state and release history. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, latest validation baseline, and rc3 publish evidence. | Read |
| docs/TASK_BOARD.md | Task queue and new T-0290 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, required reading, Docker preference, and close-source rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and Phase 7 row insertion point. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Standard task finish/ready/close/audit workflow. | Read |
| README.md | Release status and user-facing planning note target. | Read |
| docs/RELEASE_NOTES.md | Release status reconciliation target. | Read |
| package.json | Source package version verification. | Read |
| package-lock.json | Root lockfile version verification. | Read |
| docs/specs/phase7_surface_refactor/ | Source bundle for Phase 7 specs and implementation guides. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0289 handoff evidence is sufficient repository evidence that rc3 publish completed. | docs/AGENT_HANDOFF.md | README/release notes could remain stale; this task reconciles them. |
| Phase 7.0 must not implement runtime command/doc behavior. | Phase 7.0 spec | Accidentally claiming future commands would mislead agents. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep `.gitignore` narrow. | Phase 7.0 file staging review. | The existing unignore intent was extended only enough to make `docs/specs/0.3.0/` and the Phase 7 bundle trackable; other untracked planning specs remain ignored. |
| Do not copy `BUNDLE_README.md` over root `README.md`. | Phase 7 bundle README. | Only copy the bundled `docs/specs/0.3.0/` tree. |
| Do not publish or create release artifacts. | Phase 7.0 scope and release discipline. | This is docs-only planning/staging. |
