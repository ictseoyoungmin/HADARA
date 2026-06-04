# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Overstating migration as recommended. | Agents could mass-migrate historical evidence unnecessarily. | Medium | Docs now call migration selected-task maintenance, not a default broad action. | Mitigated |
| Consumers assume `task next` always returns concrete task ids. | Downstream tools can fail on handoff-only recommendations. | Medium | CLI contract/SOP now require checking `sourceKind`, `createCommand`, `taskCapsulePresent`, and `backlog`. | Mitigated |
| Operators miss the T-0240 hash-copy UX. | Execute-only remediation commands fail unexpectedly. | Low | SOP and workflow docs now show dry-run then `--before-hash <summary.beforeHash>` examples. | Mitigated |
