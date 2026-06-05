# Risks

| Risk | Mitigation | Status |
|---|---|---|
| Changing `hadara.dev.docker_check.v1` could break consumers. | Add fields only; keep `projectMutation:false` compatibility alias. | Mitigated |
| Treating all reviewer feedback as immediate work could over-expand this capsule. | Defer broader items to Phase 6.1 spec. | Mitigated |
| `--sync-dist` still lacks before-hash enforcement. | Document as Phase 6.1 follow-up and expose current `requiresBeforeHash:false`. | Open |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
