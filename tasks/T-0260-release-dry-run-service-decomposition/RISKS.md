# Risks

| Risk | Mitigation | Status |
|---|---|---|
| Refactor changes `hadara.releaseDryRun.v1` shape accidentally. | Keep existing release dry-run/schema tests and built CLI smoke. | Open |
| Type-only imports could become runtime cycles between extracted services and `release-dry-run.ts`. | Use `import type` for report/evidence shapes in extracted services. | Mitigated |
| Decomposition could imply new release capability. | Docs and tests preserve no publish/token/GitHub/Docker/PyPI/registry mutation behavior. | Mitigated |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release mutation accidentally enters a read-model slice. | Could publish or expose tokens unexpectedly. | Medium | Keep publish/token/registry actions out of scope and prove dry-run flags in tests. | Open |
