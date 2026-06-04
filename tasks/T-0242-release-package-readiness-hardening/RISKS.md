# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Additive release dry-run fields surprise strict consumers. | Consumers that assumed only old top-level fields may ignore or reject new metadata. | Low | Schema remains `hadara.releaseDryRun.v1` with additive properties; core consumers should tolerate additive fields per existing schema posture. | Mitigated |
| Next-action commands look executable. | Operators might copy artifact/package commands without intentional task selection. | Medium | Commands keep `<task-id>` placeholders and remain in read-only dry-run output; artifact refresh remains operator-selected. | Mitigated |
| Timing diagnostics become a hard performance gate by accident. | Mounted filesystem variability could create noisy failures. | Medium | Timings are report metadata only; `slowStageWarnings` are warnings, not `ok` blockers. | Mitigated |
