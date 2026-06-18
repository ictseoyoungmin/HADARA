# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Over-scanning ignored or generated directories. | Slow context routing and noisy graph candidates. | Medium | Centralized ignore rules and tested `node_modules`, `dist`, `.git`, `.hadara/local`, and cache paths. | Mitigated |
| Premature CLI/API commitment. | Later C2 extraction may need a different public shape. | Medium | Registered only schema/read-model fixture in this capsule; CLI and graph integration remain later C2 tasks. | Mitigated |
| Schema too strict for additive fields. | Later extraction fields could require schema churn. | Low | Followed existing HADARA fixture style with additive `additionalProperties:true` while requiring the stable envelope. | Mitigated |
