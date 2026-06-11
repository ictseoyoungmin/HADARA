# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Lifecycle docs drift from registry metadata. | Agents may follow stale command order. | Medium | Generate tests from `capability-registry.ts` and assert docs/help align on primary path. | Mitigated by focused tests |
| Portfolio audit accidentally implies removed/deprecated runtime behavior. | Compatibility commands could be treated as broken before removal policy exists. | Medium | Use "candidate" and "future" language; do not add runtime warnings. | Mitigated in audit docs |
| Full Docker validation remains affected by T-0291 dashboard/dogfooding timeouts. | Broader validation may be blocked again. | Medium | Run focused Phase 7.2 checks and document any residual full-suite timeout honestly. | Standard Docker wrapper timed out; focused Docker direct checks passed |
