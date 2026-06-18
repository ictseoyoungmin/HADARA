# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
# Risks

| Risk | Impact | Mitigation | Status |
|---|---|---|---|
| Markdown wording changes could produce unstable check ids. | Context graph consumers may see noisy node churn. | Use only level-2 headings as stable first-pass release-check ids and labels. | Mitigated |
| Command reference matching could over-link prose that only forbids a command. | Misleading `CHECKS_COMMAND` edges. | Restrict matching to backtick code spans that start with known command registry prefixes. | Mitigated |
| Evidence links may be absent in current release-readiness prose. | No `DEPENDS_ON_EVIDENCE` edges for current repo even though the extractor supports them. | Treat evidence-id edges as optional; state source records count zero when absent. | Accepted |
