# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Treating same-category fallback as valid for all v2 records could hide unresolved v2 failures. | Evidence proof can look stronger than the persisted ids justify. | Medium | Limit same-category fallback to legacy v1 compatibility and require exact v2 markers. | Mitigated |
| Adding `--outcome` could conflict with legacy `--result`. | JSONL v2 outcome and legacy result could disagree unexpectedly. | Medium | Make `--outcome` explicit, keep `--result` as legacy compatibility, and default legacy result from outcome when result is omitted. | Mitigated |
| Generated init docs may drift from root workflow docs. | Fresh projects may miss new options. | Low | Update generated workflow text and init regression tests when root docs change. | Mitigated |
| Full Docker validation may be slow on mounted workspace. | Validation could need rerun or escalation. | Medium | Used the `hadara-dev` Docker workflow; focused and full checks passed. | Mitigated |
