# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Command handler import error is now discovered at dispatch time. | A command with an incorrect dynamic import would fail only when invoked. | Low | Focused tests cover representative command families; full test suite exercises broad command surfaces. | Mitigated |
| Slight async import overhead per command. | Non-TUI commands may pay a tiny dispatch-time import promise cost. | Low | Avoiding eager imports is the correct startup tradeoff; full suite passed. | Accepted |
| Circular import assumptions could surface differently. | Lazy handler loading might reveal hidden top-level dependency assumptions. | Low | Full Docker sync-build and existing command tests passed. | Mitigated |
