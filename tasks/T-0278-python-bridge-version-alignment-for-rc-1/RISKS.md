# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Python/PyPI version does not match npm RC expectations. | Users cannot easily tell which npm runtime the Python bridge delegates to. | Medium | Use PEP 440 canonical `0.2.0rc1` and keep npm runtime pin `hadara@0.2.0-rc.1`. | Mitigated; metadata/docs/tests/build all use `0.2.0rc1`. |
| Publish workflow default version drifts from `pyproject.toml`. | GitHub Actions publish could fail or operator may publish an unexpected version. | Medium | Keep `expected_version` default at `0.2.0rc1` and validate local build metadata. | Mitigated; workflow and pyproject match. |
| Release mutation accidentally enters a version-alignment slice. | Could publish or expose tokens unexpectedly. | Low | Keep publish/token/registry actions out of scope and run only local tests/build/check commands. | Mitigated; no publish/upload/token command ran. |
