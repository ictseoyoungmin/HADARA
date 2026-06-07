# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `python/` contains a preview PyPI bridge package using isolated Python distribution metadata and `src` layout. | Done | `python/pyproject.toml`, `python/src/hadara/`, `python/README.md`. |
| AC-2 | The Python console script delegates to `npx -y hadara@0.2.0-rc.1` and avoids self-recursive global `hadara` discovery. | Done | `python/src/hadara/bridge.py`, `python/src/hadara/cli.py`, `python/tests/test_bridge.py`. |
| AC-3 | README and module/function docstrings clearly state this is a Node.js runtime bridge preview requiring Node.js 22+ and npx. | Done | `python/README.md`, `python/src/hadara/cli.py`, `python/src/hadara/bridge.py`, `python/src/hadara/__init__.py`. |
| AC-4 | Focused Python tests cover command construction, subprocess return-code propagation, and missing Node/npx diagnostics. | Done | `PYTHONPATH=/tmp/hadara-python-t0276-deps:src python3 -m pytest` passed 7 tests. |
| AC-5 | Local Python package build/check validation passes without TestPyPI/PyPI upload. | Done | `python3 -m build --no-isolation` built sdist/wheel; `python3 -m twine check dist/*` passed; no upload command ran. |
| AC-6 | Evidence is attached. | Done | T-0276 command-log evidence records the Python validation summary. |
| AC-7 | Handoff is updated. | Done | T-0276 task handoff and `docs/AGENT_HANDOFF.md` updated. |
