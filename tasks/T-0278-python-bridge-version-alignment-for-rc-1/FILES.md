# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `python/pyproject.toml` | Update | Set PyPI package version to `0.2.0rc1`. | Done |
| `python/src/hadara/version.py` | Update | Keep runtime `__version__` aligned with package metadata. | Done |
| `python/tests/test_cli.py` | Update | Assert the new Python bridge version. | Done |
| `.github/workflows/python-publish.yml` | Update | Default `expected_version` to `0.2.0rc1`. | Done |
| `docs/PYPI_TRUSTED_PUBLISHING.md` | Update | Show the publish/runbook version and install examples as `0.2.0rc1`. | Done |
| `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TASK_BOARD.md` | Update | Record T-0278 completion and updated publish steps. | Done |
| `tasks/T-0278-python-bridge-version-alignment-for-rc-1/*` | Update | Keep capsule scope, tests, risks, evidence, and handoff current. | Done |
