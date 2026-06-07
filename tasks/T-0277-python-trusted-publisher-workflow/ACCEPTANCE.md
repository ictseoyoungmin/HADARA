# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | A GitHub Actions workflow exists for Python bridge publishing through PyPI Trusted Publisher OIDC without checked-in tokens. | Done | `.github/workflows/python-publish.yml` uses PyPA publish action with job-level `id-token: write` and no token inputs/secrets. |
| AC-2 | The workflow is manual-dispatch only and supports separate TestPyPI and PyPI targets with matching GitHub environments. | Done | Static trigger check found no `push`, `pull_request`, `release`, or `schedule` triggers; jobs use `testpypi` and `pypi` environments. |
| AC-3 | The workflow rebuilds and validates `python/` distributions before any publish job. | Done | Build job installs package, runs pytest, builds distributions, runs `twine check`, and uploads artifacts consumed by publish jobs. |
| AC-4 | Operator docs record PyPI/TestPyPI pending publisher field values and post-publish verification commands. | Done | `docs/PYPI_TRUSTED_PUBLISHING.md` records owner/repo/workflow/environment values and install smokes. |
| AC-5 | Local validation passes without executing publish, registry mutation, GitHub Release creation, or token loading. | Done | Python tests/build/twine check and workflow boundary checks passed; publish/upload/token paths not executed. |
| AC-6 | Evidence is attached. | Done | Evidence `ev:T-0277:4ca9547e087e4717b7798812`. |
| AC-7 | Handoff is updated. | Done | Task handoff and project handoff updated with Trusted Publisher next steps. |
