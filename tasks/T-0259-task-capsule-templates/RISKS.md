# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Templates could imply work is already complete. | Operators might skip evidence/close workflow. | Medium | Templates keep Status Draft, acceptance Pending, and evidence empty. | Mitigated |
| Unknown template typo could create an unintended generic capsule. | Task queue drift and cleanup burden. | Medium | Unknown templates fail before writes and list supported ids. | Mitigated |
| Template defaults could become stale. | Repeated capsules could inherit outdated boundaries. | Low | Keep templates scoped and documented; update them when workflow contracts change. | Accepted |
