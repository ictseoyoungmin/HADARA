# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Deleted task capsule remains listed when Task Board/projection still references it. | TUI broad list may show a protocol-drift row until project docs/projections are repaired. | Medium | Treat Task Board/projection as operator source-of-truth; selected detail shows missing files; protocol doctor/task workflow gates catch drift. | Accepted |
| Legacy fallback still scans all task capsules if projection and Task Board are both absent. | Fresh non-HADARA or damaged workspaces may remain slow. | Low | Keep fallback for compatibility; future hardening can require/provision projection manifest. | Accepted |
| Fast snapshot omits full advisory sections that full read model computed. | Snapshot smoke is faster but less exhaustive than full interactive/advisory reads. | Low | Renderer already displays deferred advisory state; interactive/full paths can load detail on demand. | Mitigated |
| Task projection freshness is only as strong as existing dashboard projection metadata. | Stale projection rows may persist until refresh/status catches up. | Medium | Merge Task Board rows and show projection status/pending state from T-0228/T-0225. | Mitigated |
