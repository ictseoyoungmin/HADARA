# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0277 |
| Status | Closed valid |
| Last Updated | 2026-06-07 |

## Last Completed

| Item | Evidence |
|---|---|
| Manual Trusted Publisher workflow and runbook are prepared. | `.github/workflows/python-publish.yml` and `docs/PYPI_TRUSTED_PUBLISHING.md`; evidence `ev:T-0277:4ca9547e087e4717b7798812`. |
| Local validation passed without registry mutation. | Python tests passed 7 tests; `build --no-isolation` produced `hadara-0.0.1` sdist/wheel; `twine check dist/*` and `git diff --check` passed; publish/upload/token paths were not executed. |
| Close audit is valid. | `task audit-close --task T-0277 --json` returned `closed-valid`; latest close evidence will be refreshed after this handoff status update. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Configure pending publishers on TestPyPI and PyPI, then run GitHub Actions `Python Publish` manually. | External PyPI/TestPyPI website setup cannot be committed; workflow is ready but no publish ran locally. | `docs/PYPI_TRUSTED_PUBLISHING.md`; official PyPI Trusted Publisher docs. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Pending publishers do not reserve `hadara` until first publish. | Another user could claim the PyPI name before the first real publish. | Configure the pending publisher and run the `pypi` target only after TestPyPI smoke passes. |
| PyPI environment names are part of the trusted identity when configured. | Mismatched `pypi`/`testpypi` values will fail OIDC publish. | Use the exact runbook values for owner `ictseoyoungmin`, repository `HADARA-dev`, workflow filename `python-publish.yml`, and environments `pypi`/`testpypi`. |
