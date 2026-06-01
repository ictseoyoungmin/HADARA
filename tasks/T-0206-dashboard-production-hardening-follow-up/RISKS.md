# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Raw `source.projectRoot` still exists in v1 aggregate reports. | Browser consumers could still display an absolute path if they ignore new redacted fields. | Medium | Document as compatibility-only and add `source.project` for new consumers. | Mitigated, future v2 removal remains. |
| First uncached live reads on `/mnt/f` can still be slow. | Operators may experience delayed first data load on large or slow filesystems. | Medium | Cache hits remain fast; T-0205 performance report records controlled timings; deeper compact/bootstrap splitting remains future work. | Accepted |
| Sidebar view filtering could hide context a user expects. | Some non-Home tabs are filtered views over existing cards, not separate full pages. | Low | Active view chip and `aria-current` show the current view; all actions remain read-only. | Mitigated |
| Project fingerprint is path-derived. | Moving the project root changes cache namespace. | Low | Cache is process-memory only and not a durable identity source. | Accepted |
