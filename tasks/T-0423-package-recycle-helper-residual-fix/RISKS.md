# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Narrowing default helper smoke could be seen as weakening release proof. | Stable readiness could miss a broad graph issue. | Medium | Graph is explicit opt-in via `--include-graph`; default is documented as the installed-agent UX path. | Mitigated |
| Installed subprocesses inherit local environment state. | Disposable smoke can mutate source workspace or read the wrong project. | Medium | Installed smoke subprocesses strip `HADARA_PROJECT_ROOT`; focused tests cover env propagation and installed execute produced no stray capsule. | Mitigated |
| Docker validation unavailable or slow. | Cannot refresh `dist` to current source. | Medium | Docker focused validation passed and guarded `dist` sync executed. | Mitigated |
