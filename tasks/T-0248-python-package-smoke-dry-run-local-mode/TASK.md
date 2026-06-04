# T-0248 Python Package Smoke Dry Run Local Mode

## Metadata

| Field | Value |
|---|---|
| ID | T-0248 |
| Title | Python Package Smoke Dry Run Local Mode |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Add Python package smoke dry-run and local mode. | Extend package smoke provider support without PyPI token or publish behavior. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara package smoke --provider python` dry-run planning. | Operators can preview Python smoke steps explicitly. |
| Python local mode report path with disposable workspace and reduced output. | Adds execution-capable local path while keeping raw logs/private paths out of public report. |
| Planned/executed steps: `python -m build`, `twine check`, and `pip install wheel`. | Matches the Python preview provider command shape. |
| Tests covering local mode through injected runner. | Avoids environment dependency in validation while proving command flow. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| PyPI token loading or publish. | Python package smoke is local-only. |
| MCP package-smoke execution. | Existing no-MCP-execution boundary remains. |
| Public raw logs, package contents, or private absolute paths. | Reports stay reduced/redacted. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | Task created with HADARA CLI. |
| 2026-06-04 | Done | Finished task capsule. | `hadara task finish --execute` |
