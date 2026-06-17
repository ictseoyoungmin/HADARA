# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm registry or network access is unavailable during recycle. | Required verification cannot complete in this session. | Medium | Record failed/blocked evidence honestly and rerun when registry access is available. | Mitigated: sandbox DNS failed with `EAI_AGAIN`, approved external rerun passed. |
| Local `npx` or global shim resolves stale HADARA. | Could produce misleading package proof. | Medium | Use disposable `npm --prefix "$tmp" install hadara@latest` and installed bin path as canonical proof. | Mitigated |
| Disposable lifecycle project writes outside temp scope. | Could pollute the repository or leak local state. | Low | Create and remove temp directories under `/tmp`; run installed CLI with explicit project paths. | Mitigated: cleanup check passed. |
| `version --json` field shape differs from reviewer shorthand. | A strict root-field checker could miss dist freshness. | Low | Record actual current schema path as `build.distLooksStale:false`; package freshness value passed. | Documented |
