# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0278 |
| Status | Closed valid |
| Last Updated | 2026-06-07 |

## Last Completed

| Item | Evidence |
|---|---|
| T-0277 prepared manual PyPI/TestPyPI Trusted Publisher workflow. | `.github/workflows/python-publish.yml` exists with manual dispatch, `testpypi`/`pypi` targets, and OIDC `id-token: write`; no upload ran. |
| T-0278 aligned Python package version with the npm RC. | `python/pyproject.toml`, `version.py`, workflow default, tests, and runbook now use `0.2.0rc1`; evidence `ev:T-0278:c9e63adfd0be4d6bb398fcb0`. |
| Validation passed without registry mutation. | Python tests passed 7 tests; metadata assertion, build, twine check, wheel install smoke, old-version residue check, and `git diff --check` passed. |
| Close audit is valid. | `task audit-close --task T-0278 --json` returned `closed-valid`; latest close evidence will be refreshed after this handoff status update. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Push the version-aligned workflow/docs, configure pending publishers, and run `Python Publish` manually. | PyPI/TestPyPI setup and registry mutation remain external/operator-gated. | `docs/PYPI_TRUSTED_PUBLISHING.md`; official PyPI Trusted Publisher docs. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| No PyPI/TestPyPI upload has run. | The package name is still not reserved on PyPI. | Use the T-0277 workflow/runbook after this version alignment is pushed. |
| The Python version spelling differs from npm by design. | Operators may try `0.2.0-rc.1` in PyPI commands. | Use `0.2.0rc1` for PyPI and `0.2.0-rc.1` for npm. |
