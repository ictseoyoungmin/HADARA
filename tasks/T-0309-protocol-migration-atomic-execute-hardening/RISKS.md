# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Rollback can itself fail on unusual filesystems. | A partial write may still need manual recovery. | Low | Report rollback failures explicitly and preserve original content in memory for best-effort restore. | Mitigated |
| Overbroad helper adoption could expand blast radius. | More command surfaces could change than needed. | Low | Applied helper only to protocol migration and docs mark in this capsule. | Mitigated |
| Renumbering docs could miss a cross-reference. | T-0310/T-0311 handoff confusion. | Medium | Searched rc.2 spec, slices, handoff, and project state; updated stale next-task references. | Mitigated |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
