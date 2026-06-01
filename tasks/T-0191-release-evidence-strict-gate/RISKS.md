# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Future release evidence writer changes category/mode/source-ok fields. | Strict release gate may reject otherwise good evidence. | Medium | Keep release artifact schemas and strict gate tests aligned when writer changes. | Tracked |
| Historical summary-only release evidence no longer satisfies strict release gate checks. | Operators may need to rerun or attach reduced artifacts for strict readiness. | High | Intentional behavior; advisory/strict reports identify the missing evidence code. | Accepted |
