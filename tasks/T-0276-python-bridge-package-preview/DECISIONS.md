# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0276-1 | Put the Python bridge package under `python/` with its own `pyproject.toml` and `src/hadara` layout. | Accepted | Keeps Python distribution boundaries separate from the Node/npm root package and avoids accidentally packaging the full repository. | `python/pyproject.toml`, `python/src/hadara/`. |
| D-0276-2 | Make the console script call pinned `npx -y hadara@0.2.0-rc.1` instead of resolving a global `hadara` binary. | Accepted | Avoids self-recursive Python console-script invocation while still routing users to the official Node runtime. | `python/src/hadara/bridge.py`, `python/tests/test_bridge.py`, `python/tests/test_cli.py`. |
| D-0276-3 | Keep TestPyPI/PyPI upload out of this capsule. | Accepted | The user asked to prepare the package; registry publication should stay operator-gated after local tests/build/check evidence exists. | T-0276 scope and validation evidence. |
