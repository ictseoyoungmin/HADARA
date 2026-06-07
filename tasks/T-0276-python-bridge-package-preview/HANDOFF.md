# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0276 |
| Status | Closed valid |
| Last Updated | 2026-06-06 |

## Last Completed

| Item | Evidence |
|---|---|
| Added `python/` preview bridge package with isolated `pyproject.toml`, dedicated README, `src/hadara` modules, and console script entry point. | `python/pyproject.toml`, `python/README.md`, `python/src/hadara/`. |
| Implemented friendly Node.js bridge behavior. | Wrapper checks Node.js 22+ and `npx`, prints a setup message with no traceback when unavailable, and delegates to `npx -y hadara@0.2.0-rc.1`. |
| Validated local Python package workflow. | `pytest` passed 7 tests; `build --no-isolation` produced sdist/wheel; `twine check dist/*` passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create a separate TestPyPI/PyPI publish capsule if the operator wants to reserve/publish `hadara` on PyPI. | T-0276 intentionally stopped before registry mutation. | `python/README.md`, `tasks/T-0276-python-bridge-package-preview/TESTS.md`, `docs/TEST_STRATEGY.md`. |
| Continue npm `hadara@0.2.0-rc.1` installed-package recycle when PyPI work is paused. | rc.1 npm publish is complete and still deserves post-publish recycle evidence. | `docs/AGENT_HANDOFF.md`, T-0275 evidence, T-0271 findings. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host Python lacks `python3-venv`/`ensurepip`; `/mnt/f` venv symlink creation also failed. | Default isolated `python -m build` may fail on this host even though package metadata/build backend is valid. | Use a normal Python environment with `python3-venv`, or repeat the recorded `/tmp` target dependency plus `--no-isolation` validation path. |
| `python/dist/` contains ignored local build artifacts after validation. | Useful for inspection but not committed; stale artifacts should not be uploaded blindly later. | Rebuild from a clean checkout inside the future TestPyPI/PyPI publish capsule before upload. |
| The Python package is a bridge, not Python-native HADARA. | Users may expect native Python APIs if README/metadata are changed carelessly. | Keep README, docstrings, and stderr wording explicit until native modules are actually implemented. |
