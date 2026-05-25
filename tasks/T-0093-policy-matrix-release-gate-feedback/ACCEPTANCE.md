# Acceptance Criteria

- [x] `classifyShellCommand('npm publish', 'auto')` denies with blocked risk.
- [x] `classifyShellCommand('npm publish', 'trusted')` denies with blocked risk.
- [x] `classifyShellCommand('npm publish', 'release')` asks with high risk.
- [x] `curl`/network commands in auto/trusted modes ask with high risk.
- [x] Strict release gate CLI sets `process.exitCode = 6` when the report is not ok.
- [x] Evidence is attached.
- [x] Handoff is updated.
