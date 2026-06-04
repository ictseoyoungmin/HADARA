# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Python package smoke is selected explicitly with `--provider python`; npm remains the default. | Accepted | Preserves existing npm behavior in HADARA's own Node workspace. | T-0248 implementation. |
| D-2 | Local-mode validation uses injected-runner unit coverage instead of requiring Python build/twine availability in Docker smoke. | Accepted | Proves command flow without adding environment dependency or network/dependency installation. | T-0248 validation. |
