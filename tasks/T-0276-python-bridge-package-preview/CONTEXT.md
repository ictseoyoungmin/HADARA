# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and npm-primary release boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline after rc.1 publish. | Read |
| docs/TASK_BOARD.md | Task queue and T-0276 capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, Docker preference, and task close loop. | Read |
| docs/DEVELOPMENT_SLICES.md | Needed because this capsule completes a new release-adjacent slice. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Needed for finish/close/audit command semantics. | Read |
| docs/ARCHITECTURE.md | Needed because `python/` adds a distribution surface while preserving Node runtime primacy. | Read |
| docs/TEST_STRATEGY.md | Needed for package/build validation expectations and Python preview boundaries. | Read |
| docs/SECURITY_MODEL.md | Needed to preserve no-secret/no-release-mutation boundaries. | Read |
| docs/ROADMAP.md | Needed to keep Python bridge preview aligned with release/packaging scope. | Read |
| docs/DECISIONS.md | Needed to avoid conflicting with existing Node primary runtime decisions. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The root package remains the official HADARA runtime and npm remains the primary release target. | PROJECT_STATE, ROADMAP, T-0275 release evidence. | Python package could be mistaken for a Python-native runtime. |
| TestPyPI/PyPI publication is a separate operator-gated task. | User request and T-0276 scope. | Publishing from this capsule would exceed the approved boundary. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep Python packaging metadata under `python/`, not the repository root. | User direction and release-target preview boundary. | Prevents Node package root and Python distribution root from overlapping. |
| Use reduced public evidence only; no token, registry, or release mutation. | SECURITY_MODEL and T-0276 out-of-scope rows. | Keeps this capsule local-build-only. |
| Host Python lacks `python3-venv`/`ensurepip`, so validation uses `/tmp` target-installed tooling and `build --no-isolation`. | Observed validation environment. | Avoids writing system packages or relying on unavailable venv isolation. |
