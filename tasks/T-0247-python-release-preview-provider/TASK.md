# T-0247 Python Release Preview Provider

## Metadata

| Field | Value |
|---|---|
| ID | T-0247 |
| Title | Python Release Preview Provider |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only Python release preview metadata. | Detect Python package metadata/backend and planned commands without execution or PyPI behavior. |

## Scope

| In Scope | Reason |
|---|---|
| Read-only `pyproject.toml` parser. | Needed to preview Python package release metadata without invoking Python tooling. |
| Package name/version detection. | Operators need visible metadata before smoke/build support. |
| Build backend detection for setuptools, poetry, hatch, flit, or unknown. | Provides ecosystem-specific planning signal. |
| Planned commands only: `python -m build`, `twine check`, and `pip install wheel`. | Shows future command shape while keeping no-execution boundary. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Python command execution. | Deferred to T-0248 or later and must stay explicit. |
| PyPI token loading or publish planning/execution. | Out of scope; no publish support is claimed. |
| Mutating package artifacts or evidence attachments from Python preview. | This capsule is read-only provider preview only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | Task created with HADARA CLI. |
| 2026-06-04 | Done | Finished task capsule. | `hadara task finish --execute` |
