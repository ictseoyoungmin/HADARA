# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| PyPI package name is published before the bridge is useful. | Could create a poor first install experience or confusing package ownership signal. | Medium | Keep this capsule local-only, include friendly README/errors, and require local build/check/tests before any TestPyPI/PyPI upload. | Mitigated: no upload ran; local package tests/build/check passed. |
| Python console script recurses into itself. | Installed `hadara` command could invoke the Python wrapper repeatedly. | Medium | Do not resolve global `hadara` in the first bridge; call the pinned npm runtime through `npx -y hadara@0.2.0-rc.1` instead. | Mitigated: implementation and tests use pinned `npx` only. |
| Node runtime requirement is unclear to Python users. | Users may assume a Python-native runtime exists and file misleading bug reports. | Medium | Put the bridge-preview and Node.js 22+ requirement in README, package description, docstrings, and missing-runtime stderr. | Mitigated: README, docstrings, package description, and stderr all state Node.js 22+/npx bridge preview. |
