# Risks

| Risk | Mitigation |
|---|---|
| JSON and text output paths could drift during extraction. | Move the existing branch intact and run both built CLI smokes. |
| Exit codes for JSON failures could change. | Keep `process.exitCode = 6` in the extracted handler and rely on existing evidence tests. |
