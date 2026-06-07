# T-0277 Python Trusted Publisher Workflow

## Metadata

| Field | Value |
|---|---|
| ID | T-0277 |
| Title | Python Trusted Publisher Workflow |
| Status | Done |
| Created | 2026-06-07 |
| Updated | 2026-06-07 |

## Goal

| Goal | Notes |
|---|---|
| Add an operator-gated GitHub Actions workflow for PyPI/TestPyPI Trusted Publishing. | Use PyPI's OIDC Trusted Publisher path for the `python/` bridge package without storing PyPI tokens or enabling push-triggered publishing. |

## Scope

| In Scope | Reason |
|---|---|
| `.github/workflows/python-publish.yml` with manual `workflow_dispatch` only. | Prevents publish on ordinary push/PR while enabling operator-selected TestPyPI/PyPI publishing through OIDC. |
| Test/build/check steps for `python/` before publish jobs. | Ensures the package artifact is rebuilt in CI before any upload. |
| Documentation for PyPI/TestPyPI Trusted Publisher setup values and operator flow. | PyPI website configuration cannot be committed to the repository, so operators need exact fields. |

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
| 2026-06-07 | Draft | Created Trusted Publisher workflow capsule after T-0276 prepared the local Python bridge package. | T-0277 capsule. |
| 2026-06-07 | Done | Finished task capsule. | `hadara task finish --execute` |
