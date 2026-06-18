# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Task Board and Task Capsule extractors emit duplicate Task node ids when merged. | Graph builder ordering could affect which metadata survives. | Medium | This capsule keeps extractors independent; graph builder should define canonical merge precedence when it lands. | Open for graph builder capsule. |
| Task Board line parsing is simpler than the shared Markdown table helper because source line numbers are needed. | Escaped pipes in task titles could parse imperfectly. | Low | Current Task Board rows use simple table cells; if richer escaping appears, add a line-aware Markdown table parser in a dedicated hardening capsule. | Accepted residual risk. |
| Extractors might be mistaken for complete context graph support. | Users may expect CLI output before graph builder and command surfaces exist. | Low | Handoff and acceptance explicitly state no public graph report/CLI was added. | Mitigated. |
