# Risks

| Risk | Mitigation |
|---|---|
| Command text extraction could drift during extraction. | Reuse existing `extractPolicyCommandText` helper and run JSON/text smokes. |
| Exit codes for denied policy decisions could change. | Keep `process.exitCode = 2` in the extracted handler and run tests. |
