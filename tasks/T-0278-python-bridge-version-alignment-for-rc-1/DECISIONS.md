# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0278-1 | Use Python package version `0.2.0rc1` for the bridge that delegates to npm `hadara@0.2.0-rc.1`. | Accepted | This keeps PyPI versioning PEP 440-canonical while preserving clear correspondence to the npm RC. | `python/pyproject.toml`; `python/src/hadara/version.py`. |
| D-0278-2 | Keep actual PyPI/TestPyPI publication outside this capsule. | Accepted | The user asked for version alignment and publish instructions; registry mutation remains manual through the T-0277 Trusted Publisher workflow. | T-0278 scope; `docs/PYPI_TRUSTED_PUBLISHING.md`. |
