# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Advisory diagnostics are mistaken for automated broad-doc writes. | Operators may assume finish updates Project State/Handoff/Development Slices. | Medium | Keep fields named advisory/current/pending/missing and preserve no broad-doc writes. | Mitigated. |
| Naive mention checks mark stale docs current. | A doc might mention the task id without being semantically complete. | Medium | Treat `stateDocs` as freshness hints, not a done gate; recommendations remain operator-authored. | Accepted. |
| Existing consumers break on additive fields. | External tools might assume a smaller report. | Low | Schema remains additive and existing fields are unchanged. | Mitigated. |
