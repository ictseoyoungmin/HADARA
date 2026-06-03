# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Planned ids are deterministic preview ids, not yet written persisted ids. | Operators could mistake preview output for completed migration. | Medium | Report is explicitly mode `dry-run`, `executeSupported:false`, and execute mode returns an error. | Mitigated. |
| Future execute mode must preserve preview hash guards. | Concurrent edits could otherwise rewrite stale evidence. | High | Report includes `beforeHash`; execute remains out of scope until hash guards are implemented. | Deferred. |
| `EVIDENCE.md` remains unchanged. | Human table still lacks persisted ids for migrated historical records. | Medium | Keep Markdown rewrite as a separate dry-run-first capsule. | Deferred. |
| Repository-wide migration could be expensive on `/mnt/f`. | Broad scanning could regress responsiveness. | Medium | This capsule is per-task only; repo-wide planning remains deferred. | Mitigated. |
