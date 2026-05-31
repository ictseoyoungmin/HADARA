# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docs repeat command semantics inconsistently. | Agents may choose the wrong command or expect writes from read-only commands. | Medium | Introduce one workflow contract doc and regression tests across README/SOP/CLI contract. | Mitigated |
| Operators treat `task status.ok` as readiness. | Workbench reports could be misread as close approval. | Medium | Explicitly document `ok` as report generation and point readiness to `state.ready`, blockers, and issues. | Mitigated |
| Finish/close write boundaries blur. | Broad state docs could be mutated accidentally by the wrong command. | Low | Document `finish` as bounded status sync and `close` as close-evidence-only. | Mitigated |
