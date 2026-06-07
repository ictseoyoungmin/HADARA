# T-0276 Python Bridge Package Preview

## Metadata

| Field | Value |
|---|---|
| ID | T-0276 |
| Title | Python Bridge Package Preview |
| Status | Done |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |

## Goal

| Goal | Notes |
|---|---|
| Add a preview Python bridge package under `python/` for future PyPI distribution. | Keep the current Node/npm runtime primary, expose a friendly Python console-script bridge, and stop before TestPyPI/PyPI publication. |

## Scope

| In Scope | Reason |
|---|---|
| `python/` package scaffold with `pyproject.toml`, README, and `src` layout. | Keeps Python distribution boundaries separate from the Node/npm root package. |
| Friendly console-script bridge implementation with docstrings. | Makes `pip install hadara` a useful official bridge while clearly explaining Node.js requirements. |
| Focused Python tests and local build/twine-check validation. | Proves the bridge package can install, route to the npm runtime through `npx`, and fail clearly when Node/npx is unavailable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No publish execution | This capsule prepares a local PyPI bridge package only. |
| No token loading | Template boundary. |
| No registry mutation | TestPyPI/PyPI upload remains a separate operator-gated step. |
| No GitHub Release creation | Template boundary. |
| No Docker image build | Template boundary. |
| No PyPI upload | Template boundary. |
| No release mutation | Template boundary. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-06 | Draft | Created Python bridge package preview capsule and narrowed scope to local scaffold/build validation without PyPI mutation. | T-0276 capsule docs. |
| 2026-06-06 | Done | Finished task capsule. | `hadara task finish --execute` |
