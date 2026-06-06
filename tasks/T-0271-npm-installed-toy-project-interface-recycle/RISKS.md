# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm registry/network is unavailable from `hadara-recycle`. | Install cannot be validated. | Medium | Checked `npm view` first; registry visibility passed. | Mitigated |
| The toy project accidentally mutates the HADARA-dev workspace. | Validation evidence becomes ambiguous. | Low | Used container `/tmp/hadara-recycle-toy-0271` and installed binary there. | Mitigated |
| Commands that imply publish/deploy are accidentally executed. | External mutation risk. | Low | Used dry-run/read-only release/package/install modes only; no tokens loaded. | Mitigated |
| Toy project is too small to reveal meaningful UX issues. | Findings may be shallow. | Medium | Exercised task, evidence, policy, Hermes, MCP, dashboard, TUI, run, release, package, install, smoke, debt, and status surfaces. | Mitigated |
