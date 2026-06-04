# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add lifecycle guidance as additive report fields rather than new commands or broad writes. | Accepted | Existing close/audit commands are the correct operator surface; the missing piece is clearer machine-readable semantics. | T-0238 TASK.md |
| D-2 | Keep audit warnings non-blocking unless close evidence is missing or invalid. | Accepted | Source/report drift after close is an audit signal; it should not invalidate the existence of a valid close record unless the close evidence itself is malformed. | Existing T-0170 close model |
