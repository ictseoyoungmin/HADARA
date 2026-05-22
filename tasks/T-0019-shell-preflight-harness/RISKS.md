# Risks

| Risk | Mitigation |
|---|---|
| Fake shell harness is mistaken for real shell execution. | Keep the schema and module name explicit and avoid `child_process` usage. |
| Policy parser scope expands during tool harness work. | Use existing `createShellExecutionPreflight` as the gate and do not add shell semantics in this slice. |
| Approval-required commands accidentally return configured fake output. | Block fake fixture lookup unless preflight status is `allowed`. |
| Future approval flow becomes implicit. | Treat approval-required commands as structured blocked observations until an explicit approval flow exists. |
