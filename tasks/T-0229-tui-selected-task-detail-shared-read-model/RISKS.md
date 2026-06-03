# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Document viewer still reads Task Capsule Markdown files. | `/mnt/f` snapshot smoke may remain slow until task index/cache/document strategy changes. | High | Keep this as T-0230/T-0231 scope; T-0229 only moves selected proof/evidence semantics. | Open |
| Dashboard task-detail aggregate is live and not projection-backed. | Selected task detail may still read bounded task/evidence files. | Medium | Use it for semantic alignment now; T-0230 handles broader projection/cache path replacement. | Open |
| Private evidence behavior could regress if selected evidence always uses dashboard detail. | Explicit private evidence mode is used by tests and may be needed by operators. | Low | Keep `includePrivateEvidence` on the existing evidence-list path while default public mode uses dashboard detail. | Mitigated |
| Shared proof copy could crowd overview cards. | Snapshot layout may clip proof note/status. | Low | Use existing bounded line fitting and focused snapshot tests. | Mitigated |
