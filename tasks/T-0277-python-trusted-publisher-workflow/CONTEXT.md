# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and T-0276 Python bridge boundary. | Read |
| docs/AGENT_HANDOFF.md | Current next step names TestPyPI/PyPI bridge publish capsule. | Read |
| docs/TASK_BOARD.md | Task queue and T-0277 capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and required reading registry. | Read |
| docs/DEVELOPMENT_SLICES.md | Required when adding a new release/publish-adjacent slice. | Read |
| docs/TEST_STRATEGY.md | Release and GitHub Actions validation/evidence expectations. | Read |
| docs/SECURITY_MODEL.md | No secrets in files/logs; no unapproved release mutation. | Read |
| docs/ROADMAP.md | Release/packaging track boundaries. | Read |
| docs/ARCHITECTURE.md | Distribution surface must not imply Python-native runtime or MCP write expansion. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit semantics. | Read |
| PyPI Trusted Publishers docs | Official OIDC workflow requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| GitHub repository is `ictseoyoungmin/HADARA-dev`. | `git remote -v`. | PyPI Trusted Publisher registration would fail if owner/repo fields differ. |
| PyPI project name remains `hadara` and Python package version remains `0.0.1`. | `python/pyproject.toml`. | Trusted Publisher first publish would target the wrong project/version. |
| Operators will configure PyPI/TestPyPI website publishers before running publish jobs. | PyPI docs and user request. | Workflow publish job will fail if no matching pending/normal publisher exists. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Workflow must be manual-dispatch only. | User asked to try Trusted Publisher, not automatic publish on push. | Avoids accidental publish from ordinary pushes. |
| No PyPI tokens or secrets in repository files. | PyPI Trusted Publisher OIDC model and SECURITY_MODEL. | Keep authentication short-lived through GitHub OIDC. |
| GitHub environment names must match PyPI publisher setup. | PyPI docs strongly encourage environment configuration. | Use `testpypi` and `pypi` environments consistently. |
