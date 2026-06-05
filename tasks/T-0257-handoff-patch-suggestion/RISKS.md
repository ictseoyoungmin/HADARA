# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Suggestions could be mistaken for applied handoff updates. | Operators might assume shared docs changed. | Medium | Report `readOnly:true`, target before-hash, section fragments, coordinator role, and explicit no-execute behavior. | Mitigated |
| A future caller could pass `--execute` expecting mutation. | Hidden writes would violate Phase 6 dry-run-first boundaries. | Medium | `--execute` returns `ok:false`, exit 6, and `HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED` without writes. | Mitigated |
| Suggested fragments may be generic when evidence is sparse. | Handoff text may require coordinator review. | Low | Report is explicitly a suggestion surface with manual-review sections. | Accepted |
