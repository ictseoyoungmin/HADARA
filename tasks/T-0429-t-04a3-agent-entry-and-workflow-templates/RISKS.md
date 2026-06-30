# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| AGENTS drifts back into a lifecycle command cookbook. | Agents may follow stale copied recipes instead of workflow/registry help. | Medium | Generated AGENTS tests reject lifecycle/finalize/context pack recipes. | Mitigated |
| HADARA_CONTEXT duplicates Required Reading authority. | Agents may treat context as a second policy source. | Medium | Context template is routing-only and tests reject Required Reading/workflow tables. | Mitigated |
| Workflow mentions proposed commands before implementation. | Agents may try `docs register` before T-04A4 exists. | Medium | Workflow labels it as the 0.4 registry surface and points to registry-backed help; implementation remains T-04A4. | Accepted |
