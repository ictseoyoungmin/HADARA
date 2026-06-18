# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Registering every detailed spec as default current-state reading would increase startup token load. | Agents may over-read broad implementation specs. | Medium | Marked context-routing specs as reference/conditional and kept worker plan routing to overview plus active spec only. | Mitigated |
| Docs registry and SOP can drift if only one surface is updated. | `docs required-reading` and human instructions disagree. | Medium | Updated SOP, `docs/DOC_REGISTRY.md`, and `.hadara/docs-registry.json` together. | Mitigated |
