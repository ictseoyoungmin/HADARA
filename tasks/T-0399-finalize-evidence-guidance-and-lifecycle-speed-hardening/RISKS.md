# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Lazy report evaluation could hide later blockers until earlier lifecycle steps are satisfied. | Operators see fewer diagnostics on Draft/blocked tasks. | Medium | Expose `summary.evaluatedReports` and `summary.skippedReports`; keep step statuses pending for skipped phases. | Mitigated |
| Evidence-quality detection could be too broad or too narrow. | The primary next action might not always be the perfect repair command. | Low | Keep the hint additive and scoped to known weak-evidence issue code patterns; readiness still reports underlying blockers. | Mitigated |
| Full Docker validation can be flaky under dashboard-static timing. | A transient timeout could be mistaken for a regression. | Medium | Record the failed timeout honestly and attach a resolving passed full sync-build retry. | Resolved |
