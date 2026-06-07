# T-0278 Python Bridge Version Alignment for rc.1

## Metadata

| Field | Value |
|---|---|
| ID | T-0278 |
| Title | Python Bridge Version Alignment for rc.1 |
| Status | Done |
| Created | 2026-06-07 |
| Updated | 2026-06-07 |

## Goal

| Goal | Notes |
|---|---|
| Align the Python bridge package version with npm `hadara@0.2.0-rc.1`. | Use the PEP 440 canonical Python release-candidate form `0.2.0rc1` before any TestPyPI/PyPI publish. |

## Scope

| In Scope | Reason |
|---|---|
| `python/` package metadata and runtime version constants. | PyPI package version should correspond to the npm RC runtime it delegates to. |
| Python publish workflow default expected version. | Prevent accidental publish when `pyproject.toml` and workflow input drift. |
| PyPI Trusted Publisher runbook and tests. | Keep operator instructions and local assertions aligned with the package version. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No publish execution | Template boundary. |
| No token loading | Template boundary. |
| No registry mutation | Template boundary. |
| No GitHub Release creation | Template boundary. |
| No Docker image build | Template boundary. |
| No PyPI upload | Template boundary. |
| No release mutation | Template boundary. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-07 | Draft | Created version-alignment capsule after T-0277 Trusted Publisher workflow setup. | T-0278 capsule. |
| 2026-06-07 | Done | Finished task capsule. | `hadara task finish --execute` |
