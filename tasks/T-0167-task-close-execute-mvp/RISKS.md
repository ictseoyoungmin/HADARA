# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Execute mode broadens writes accidentally. | Could mutate user docs beyond close evidence. | Medium | Keep implementation to `appendEvidence()` only; no status/doc updates. | Mitigated |
| Close evidence append changes validation inputs. | Could restart fixed-point loop. | Medium | Report marks close evidence `excludedFromCurrentValidationLoop: true`. | Mitigated |
