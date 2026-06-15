# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm registry/network access fails in the sandbox. | Published package validation cannot complete locally. | Medium | Direct registry/temp-prefix install passed; exact isolated npx hit `EAI_AGAIN` and is recorded as failed environment evidence. | Partially Mitigated |
| Global `hadara` resolves to an older package. | Recycle results could verify the wrong binary. | Medium | Used temp-prefix installed bin for authoritative package execution; exact npx/global ambiguity recorded in `FINDINGS.md`. | Mitigated with Finding |
| Disposable consumer fixtures accidentally mutate the HADARA-dev workspace. | Evidence becomes ambiguous and close-source docs can drift. | Low | Created consumer fixtures under `/tmp` and pointed installed commands at those projects. | Mitigated |
| Full Docker validation is mistaken as required for this task. | Work duplicates source readiness and still misses registry-installed behavior. | Low | Record T-0315 as source readiness baseline and make T-0317 published-package validation the compensating check. | Mitigated |
