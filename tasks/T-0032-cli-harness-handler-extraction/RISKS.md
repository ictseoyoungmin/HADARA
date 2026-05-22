# Risks

| Risk | Mitigation |
|---|---|
| Exit codes could drift during extraction. | Keep process exit code assignment in the extracted handler and run built CLI smokes. |
| Parser exports could move unexpectedly. | Update focused tests to import from the new harness CLI module. |
