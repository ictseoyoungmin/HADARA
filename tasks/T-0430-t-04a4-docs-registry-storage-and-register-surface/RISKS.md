# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Registration could reintroduce duplicate prose registration rows. | Agents may again see conflicting required-reading authorities. | Low | `docs register` writes only `.hadara/docs-registry.json`; tests assert no AGENTS/context/workflow/projection mutation by default. | Mitigated |
| New registry entries could over-expand default reading. | Session startup becomes noisy. | Low | Defaults are `status: reference`, `readWhen: only-when-linked`, `requiredReading: false`. | Mitigated |
| Later read-map metadata may need richer fields. | Future 0.4 slices may add metadata migration work. | Medium | T-04A4 stays additive over current registry shape; later read-map work can extend entries without breaking this surface. | Accepted |
