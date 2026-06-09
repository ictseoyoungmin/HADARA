# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Project-wide CI gate can be slower on this large mounted workspace. | Broad scans may be expensive. | Medium | MVP supports focused `--task` checks; optimize broad aggregation later if needed. | Accepted |
| Docker baseline unavailable during this session. | Full repository confidence is lower than normal Docker sync-build. | Medium | `/tmp` build and focused tests passed; rerun Docker before rc3 readiness if available. | Open |
