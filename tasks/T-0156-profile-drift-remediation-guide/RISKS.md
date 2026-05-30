# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Generic remediation hints are too vague to guide users. | Medium | Medium | Include concrete paths, expected target profile, dry-run command, and per-file manual steps. | Mitigated |
| Profile inference over-warns on legacy projects. | Medium | Medium | Keep drift severity warning unless required docs are truly missing; preserve read-only behavior. | Mitigated |
| Remediations imply automatic execution. | Medium | Low | Mark mode as `manual` and defer safe-auto execution to T-0157. | Mitigated |
