# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Generated docs become too verbose for basic projects. | Basic scaffold UX gets noisy. | Medium | Keep new guidance short and tied to concrete commands. | Mitigated |
| `harness validate` guidance is mistaken for an extra required standard-loop step. | Users duplicate validation unnecessarily. | Medium | Phrase it as direct diagnostic only; keep standard loop unchanged. | Mitigated |
| Broad ignore patterns hide intentional project files. | Users may need to force-add unusual SQLite/DB fixtures. | Low | Limit to common local artifacts and document no broad `data/` ignore in generated init. | Mitigated |
