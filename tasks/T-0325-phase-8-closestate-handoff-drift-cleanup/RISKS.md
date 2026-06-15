# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Removing `CloseState` from HANDOFF could make close proof less visible to workers. | Workers may wonder where close state lives. | Medium | Update workflow docs, generated docs, specs, and validation fix hints to point at task status/audit/proof/state read models. | Mitigated |
| Editing closed Phase 8 handoff docs can stale their historical close proofs. | Old task audit-close may report stale if rerun against changed close-source docs. | Medium | Treat T-0325 as the authoritative current cleanup close; avoid changing old evidence and document the source-of-truth boundary. | Accepted |
| Validation may miss generated-doc drift if init strings are not updated. | New projects could still get old guidance. | Low | Update `src/cli/init.ts` and run init/workflow focused tests plus full Docker sync-build. | Mitigated |
| Discovery hardening could hide malformed duplicate task-id directories. | Operators might not see local garbage as task drift. | Low | Only directories without `TASK.md` are ignored as capsules; Task Board and source docs remain authoritative. | Mitigated |
