# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and completion evidence. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit loop. | Read |
| docs/PYPI_TRUSTED_PUBLISHING.md | Current PyPI Trusted Publisher workflow/runbook values. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The Python package should use PEP 440 canonical RC spelling `0.2.0rc1` while delegating to npm `hadara@0.2.0-rc.1`. | User request and Python packaging normalization check from prior turn. | PyPI package version could confuse users if it does not correspond to the npm runtime version. |
| Actual PyPI/TestPyPI publish remains external/manual. | T-0277 runbook and task scope. | Running local upload or loading tokens here would violate the requested publish boundary. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No PyPI/TestPyPI upload, GitHub Actions publish execution, token loading, npm publish, or registry mutation in this capsule. | T-0278 scope and T-0277 runbook. | Version alignment only. |
| Use local Python tests/build/twine checks for validation. | T-0276/T-0277 validation baseline. | Host Python uses `/tmp` target-installed build dependencies and `--no-isolation`. |
