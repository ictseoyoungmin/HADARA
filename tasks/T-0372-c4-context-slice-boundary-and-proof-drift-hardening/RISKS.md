# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Editing T-0370 close-source docs can make old close evidence stale. | Medium | High | Repair the drift because the user explicitly requested it; avoid volatile close evidence ids and rely on T-0372 validation/close for the new proof. | Accepted |
| Byte-budget failure can reject a request that previously returned text with a warning. | Medium | Medium | Use explicit `CONTEXT_SLICE_TOO_LARGE` with fix hint so callers can narrow `--from/--to` or `--window`. | Mitigated |
| `.hadara/local` denial may block local cache debugging through context slice. | Low | Medium | Defer any override flag until a reviewed use case exists. | Accepted |
| C6 ext4/mounted comparison remains pending. | Medium | High | Split into next capsule so measurement does not blur the C4 safety fix. | Carry Forward |
