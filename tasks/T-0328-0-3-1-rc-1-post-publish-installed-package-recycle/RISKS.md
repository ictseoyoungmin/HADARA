# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm registry propagation, DNS, or npx cache causes flaky exact package execution. | Could obscure whether the published package works. | Medium | Used npm registry metadata plus temp-prefix installed-bin proof as canonical; exact npx also passed in the container. | Mitigated |
| Recycle mutates developer machine global state. | Could leave stale or unwanted global installs. | Low | Used disposable temp-prefix installs and temp project directories, then verified `/tmp/hadara-recycle-T-0328*` cleanup. | Mitigated |
| Server or Docker-dependent commands are not single-shot CLI exits. | Could be misread as product failures during a broad CLI surface sweep. | Medium | Used bounded `timeout` for `dashboard serve` and treated nested Docker absence for `dev docker-check` as expected environment behavior; all other command-family smokes passed. | Mitigated |
