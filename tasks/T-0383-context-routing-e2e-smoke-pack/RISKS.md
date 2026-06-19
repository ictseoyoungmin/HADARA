# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full context-routing smoke becomes another slow mounted-filesystem harness. | Operators avoid running it or it times out during routine work. | High | Default `fast` profile covers bounded Session Start and Slice; graph/cache/pack are opt-in through `--profile full` or `--workloads`. | Mitigated |
| Smoke commands accidentally mutate context cache. | Violates read command/cache-is-not-truth contract. | Medium | Script fingerprints `.hadara/local/cache/context` before/after and fails if it changes. | Mitigated |
| Fake CLI tests miss real built CLI behavior. | Script wiring passes while current runtime output drifts. | Medium | Capsule validation includes an actual built CLI fast smoke; Docker focused tests cover script logic. | Mitigated |
| Cache/graph/pack timeout observations are mistaken for regressions introduced by this script. | Scope creep into runtime optimization. | Medium | Record as T-0384/T-0385 input; this capsule only provides the smoke wrapper. | Accepted |
