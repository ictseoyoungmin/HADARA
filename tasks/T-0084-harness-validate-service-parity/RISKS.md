# Risks

| Risk | Mitigation |
|---|---|
| Service wrapper could imply validation behavior changed. | Keep it a thin wrapper and run existing harness validation tests. |
| CLI and MCP could drift from the shared report builder. | Update parity and bridge contract tests to compare against `createHarnessValidateReport`. |
| Scope could expand into replay or validation-rule changes. | Keep replay and rule changes explicitly out of scope. |
