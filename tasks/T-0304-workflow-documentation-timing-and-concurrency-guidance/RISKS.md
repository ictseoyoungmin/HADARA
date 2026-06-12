# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Guidance becomes noisy or duplicated. | Agents may ignore the rules or docs become harder to scan. | Medium | Root AGENTS uses concise bullets; SOP/workflow docs own the detailed table. | Mitigated |
| Generated docs drift from root docs. | Fresh projects would lack the new workflow guidance. | Medium | Init tests assert generated AGENTS/SOP/workflow docs include the guidance. | Mitigated |
| Full suite not run. | Unrelated regressions could be missed. | Low | Touched surfaces are docs/templates/tests; focused tests, build, and built smoke passed. | Accepted |
