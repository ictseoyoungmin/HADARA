# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Live npm registry/install recycle can fail for network or registry propagation reasons. | Release operator may need to rerun after publish propagation. | Medium | Dry-run is default; execute report isolates registry/version/dist-tag/install steps and returns clear issue codes. | Mitigated |
| Public recycle reports could leak raw npm logs or private temp paths. | Evidence/privacy boundary violation. | Low | Report stores reduced summaries, redacted paths, raw log/content booleans fixed false, and tests assert project paths/node_modules are absent. | Mitigated |
| New package command could be confused with source tarball `package smoke`. | Release evidence could mix source and published package proof. | Medium | Command registry/docs distinguish `package.smoke` from `package.recycle`; schemas use distinct ids and command names. | Mitigated |
