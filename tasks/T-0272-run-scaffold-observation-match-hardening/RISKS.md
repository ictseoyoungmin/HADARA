# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Matcher is too broad for future failed fixture scaffolds. | A future generated script for non-zero exit might match a success-only assumption incorrectly. | Low | Current `run scaffold` success fixture default remains status completed; future failure-specific scaffold can select failure status. | Accepted |
| Observation envelope formatting changes. | Generated scripts could fail again if fake-shell observations no longer include compact JSON status text. | Low | Regression covers the current run loop serialization path. | Mitigated |
| Docker wrapper temp-workspace failure is hidden by redacted logs. | Official wrapper did not complete in this container and needs separate diagnosis. | Medium | T-0272 used explicit `/tmp` temp-copy validation; wrapper/loggability issue is carried into follow-up legacy/UX fixes. | Carry Forward |
