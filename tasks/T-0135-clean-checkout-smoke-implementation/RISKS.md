# Risks

| Risk | Mitigation |
|---|---|
| Clean checkout smoke mutates the source workspace. | Copy source into an external disposable workspace and run all commands there; tests check source marker stability. |
| Raw command logs leak into public reports. | Report only step labels, redacted commands, exit codes, elapsed time, and stable summaries. |
| `--keep-temp` leaves temporary content. | Public report redacts the retained path and marks retention as local/private temporary content; cleanup remains default. |
| Scope drifts into package/install smoke. | Keep this command source-checkout only; no `npm pack`, package install, isolated prefix install, installed `hadara` proof, or evidence attachment. |
| Nested validation is slow. | Keep unit tests injected/mocked and use Docker built CLI smoke for one end-to-end proof. |
