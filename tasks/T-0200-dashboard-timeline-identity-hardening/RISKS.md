# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Legacy ids remain unstable on reorder. | Consumers could over-trust generated ids. | Medium | Expose `idSource`/`idStability` and keep persisted v2 ids deferred to evidence writer work. | Accepted |
| Timeline has a small local parser for source-line preservation. | Parser drift could appear if evidence-list parsing changes. | Low | Evidence-list remains diagnostic source; timeline parser only consumes valid v1 rows and focused tests cover metadata. | Accepted |
