# Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Candidate heuristics miss some stale rows. | Operators may still need manual review. | Report is advisory and intentionally conservative for trust. |
| Candidate heuristics become noisy. | Agents may ignore the report. | Built current-repo smoke verifies `candidates:0` after false-positive tightening. |
| Full Docker suite timeout obscures feature validation. | Release confidence could be overstated. | Failed full attempt is recorded; focused build/tests and built smoke passed. |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
