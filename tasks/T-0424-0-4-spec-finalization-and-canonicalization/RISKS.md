# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| 0.4 product defaults overfit to HADARA-dev. | New projects would inherit irrelevant Node/npm/Docker/release guidance. | Medium | Added explicit product-generalization boundary and product-default tests. | Mitigated |
| Evidence projection command is mistaken for current CLI behavior. | Implementers could document or test a command before adding it. | Medium | Marked `evidence project` as proposed in CLI contract and audit docs. | Mitigated |
| Excluding `HANDOFF.md` from close-source hides task contract changes. | Agents might use handoff to change closed scope. | Low | Close-source spec says contract changes must update `TASK.md` and rerun finalize. | Mitigated |
| Required Reading registration is skipped in this capsule. | Future agents may miss the finalized spec until T-04A1. | Medium | README, TREE, manifest, `.gitignore`, and T-04A plan make registration path explicit. | Accepted |
