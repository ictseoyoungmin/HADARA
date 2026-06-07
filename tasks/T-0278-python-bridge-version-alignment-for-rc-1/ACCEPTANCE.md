# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Python bridge package metadata reports `0.2.0rc1` while still delegating to npm `hadara@0.2.0-rc.1`. | Done | `python/pyproject.toml` and `hadara.__version__` both report `0.2.0rc1`; `NPM_RUNTIME_SPEC` remains `hadara@0.2.0-rc.1`. |
| AC-2 | The GitHub Actions Python Publish workflow default `expected_version` is `0.2.0rc1`. | Done | `.github/workflows/python-publish.yml` default updated. |
| AC-3 | PyPI Trusted Publisher docs use `0.2.0rc1` for expected version and install verification commands. | Done | `docs/PYPI_TRUSTED_PUBLISHING.md` updated. |
| AC-4 | Focused Python tests, build metadata checks, twine check, and patch hygiene pass without publish or registry mutation. | Done | 7 Python tests passed; metadata assertion passed; build produced `hadara-0.2.0rc1` sdist/wheel; twine check and wheel install smoke passed; `git diff --check` passed. |
| AC-5 | Evidence is attached. | Done | Evidence `ev:T-0278:c9e63adfd0be4d6bb398fcb0`. |
| AC-6 | Handoff is updated. | Done | Task and project handoff updated with `0.2.0rc1` publish next steps. |
