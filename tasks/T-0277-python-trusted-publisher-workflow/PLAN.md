# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and PyPI Trusted Publisher docs. | Done | Required docs and official PyPI docs read. |
| 2 | Add manual GitHub Actions Trusted Publisher workflow for `python/`. | Done | `.github/workflows/python-publish.yml` added with manual `workflow_dispatch`, build-first artifact flow, and separate TestPyPI/PyPI publish jobs. |
| 3 | Add operator documentation for pending publisher setup and publish flow. | Done | `docs/PYPI_TRUSTED_PUBLISHING.md` records exact publisher values and verification commands. |
| 4 | Run local validation for workflow/docs/package checks. | Done | Python tests/build/twine check, workflow trigger boundary checks, and `git diff --check` passed. |
| 5 | Attach evidence and update handoff/state docs. | Done | Evidence `ev:T-0277:4ca9547e087e4717b7798812`; state docs updated. |
