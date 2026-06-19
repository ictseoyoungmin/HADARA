# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Audit overclaims implementation completeness. | Later agents may skip needed hardening. | Medium | Use explicit `Partial`, `Deferred`, and follow-up rows instead of marking the whole spec fully done. | Mitigated |
| Registry drift after adding the audit document. | Required-reading and docs explain surfaces may miss the new artifact. | Low | Update JSON registry, DOC_REGISTRY, and SOP together; validate JSON parse and path existence. | Mitigated |
| Docs-only validation under-tests runtime assumptions. | A behavior bug could be missed. | Low | Keep T-0381 docs-only and route runtime hardening to T-0382 through T-0387. | Accepted |
