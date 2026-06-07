# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `PYTHONPATH=/tmp/hadara-python-t0276-deps:src python3 -m pytest` from `python/` | Run focused Python bridge tests. | Yes | Passed: 7 tests. | 2026-06-06 local host validation. |
| `PYTHONPATH=/tmp/hadara-python-t0276-deps python3 -m build --no-isolation` from `python/` | Build source and wheel distributions locally. | Yes | Passed: built `hadara-0.0.1.tar.gz` and `hadara-0.0.1-py3-none-any.whl`. | 2026-06-06 local host validation. |
| `PYTHONPATH=/tmp/hadara-python-t0276-deps python3 -m twine check dist/*` from `python/` | Validate distribution metadata/readme rendering. | Yes | Passed: wheel and sdist. | 2026-06-06 local host validation. |
| `git diff --check` | Check whitespace/patch hygiene. | Yes | Passed after close-doc updates. | 2026-06-06 local host validation. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| TestPyPI/PyPI upload | No | Publishing is intentionally out of scope for this scaffold capsule. | Not Run | No upload command ran. |
| Installed console-script smoke | Optional | Useful after local build or TestPyPI publication; not required before scaffold close because focused tests cover routing, return codes, Node 22 checks, and diagnostics. | Not Run | Deferred to TestPyPI/PyPI publish capsule. |
| Default isolated `python -m build` | No | Host Python lacks `python3-venv`/`ensurepip`; the same backend was validated with `/tmp` target-installed dependencies and `--no-isolation`. | Not Run after environment probe | Environment note captured in `CONTEXT.md`. |
