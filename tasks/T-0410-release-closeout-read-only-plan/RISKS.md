# Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Signal matching is simple. | A doc can be semantically current while missing exact tokens. | Report is advisory and includes missing signals for human review. |
| Suggested fragments become stale. | Operators could copy incomplete release wording. | Fragments are intentionally generic and require review. |
| Full suite not rerun. | Regression risk remains outside focused surface. | Focused build/tests, schema fixture test, built smoke, and diff check passed; T-0409 records current full-suite timeout limitation. |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
