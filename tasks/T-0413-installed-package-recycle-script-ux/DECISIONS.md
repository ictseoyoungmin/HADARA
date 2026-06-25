# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `hadara package recycle` instead of extending `package smoke`. | Accepted | `package smoke` proves source/tarball installability; recycle proves the published npm consumer path after registry propagation. Separate commands keep evidence semantics clear. | ev:T-0413:db037677d84640d39722a7c7 |
| D-2 | Keep dry-run as the default mode and require `--execute` for npm/install subprocesses. | Accepted | Release/package operations should stay reviewable and non-mutating by default. | ev:T-0413:db037677d84640d39722a7c7 |
| D-3 | Validate execute behavior with fake runner unit tests, not live npm registry calls. | Accepted | The implementation should be deterministic in CI/local validation; live registry recycle remains an operator/environment check after publish. | ev:T-0413:db037677d84640d39722a7c7 |
