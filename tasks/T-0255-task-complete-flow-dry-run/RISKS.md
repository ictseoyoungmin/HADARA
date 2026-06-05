# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| `task complete` could be mistaken for an execute command. | Hidden writes would weaken HADARA dry-run-first workflow. | Medium | `--execute` returns a blocked read-only complete-flow report; docs state no execute mode. | Mitigated |
| Flow stage selection could drift from lifecycle report behavior. | Operators could receive stale or contradictory next actions. | Medium | Service composes `createTaskFinishReport`, `createTaskReadyReport`, `createTaskCloseReport`, and `createTaskAuditCloseReport` directly; tests cover main stages. | Mitigated |
| Shared-doc advisories could be hidden by workflow compression. | Coordinator handoff/state work could be skipped. | Low | Complete-flow report surfaces `stateDocs`, `SHARED_DOC_PENDING`, and coordinator-oriented primary action when finish bookkeeping is current. | Mitigated |
| Mounted workspace test setup can fail on npm symlinks. | Focused validation could be blocked. | Medium | Use the documented Docker temp-copy sync-build workflow for reproducible validation. | Mitigated |
