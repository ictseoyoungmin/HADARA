# Risks

| Risk | Mitigation |
|---|---|
| Feedback is based on stale code, causing duplicate or noisy changes. | Inspect current implementation first and limit code edits to missing or weak regression coverage. |
| `process.exitCode` leaks across tests. | Reset `process.exitCode` in `afterEach` and keep strict release-gate exit-code assertions isolated. |
| Broad policy semantics change accidentally. | Run focused policy/release-gate tests and full Docker validation. |
