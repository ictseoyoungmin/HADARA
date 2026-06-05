# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release mutation accidentally enters a read-model slice. | Could publish or expose tokens unexpectedly. | Low | Used only release artifact execute, package/clean smoke execute, and release/publish dry-run; publish/GitHub/Docker mutation flags stayed false. | Mitigated |
| RC metadata gate remains pinned to the first RC. | Blocks future RC readiness or encourages stale docs. | Medium | Generalized metadata readiness to `0.x.0-rc.N` and updated tests. | Mitigated |
| Package-smoke parser depends on npm stdout shape. | False failed smoke evidence in environments where `npm pack --json` writes no stdout. | Medium | Fallback to a single `.tgz` in the pack workspace and added regression coverage. | Mitigated |
| Installed CLI stdout capture may be empty in this environment. | False failed doctor/core smoke despite exit 0. | Medium | Treat empty stdout as acceptable only with exit 0; direct failure still blocks. | Mitigated |
| Evidence-only commits after release artifact refresh could make artifact freshness appear stale. | Release dry-run could block after final evidence commit. | Low | Post-evidence-commit release dry-run passed and accepted the artifact across evidence-only commit. | Mitigated |
