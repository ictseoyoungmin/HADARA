# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| State projection warnings become noisy on historical HADARA-dev drift. | Workers may mistake advisory drift for a strict blocker. | Medium | `stateConsistency.strictBlocking:false`; `ci gate` maps state issues to warnings only; COMMAND_SURFACE documents advisory rollout. | Mitigated |
| Adding state projection to common status paths slows dashboard/TUI reads. | Operator surfaces could regress on mounted workspaces. | Medium | `createOpsStatusReport` keeps state consistency optional; only CLI `status` enables it by default. | Mitigated |
| New command registry entry drifts from lifecycle docs. | Full validation fails or help output becomes inconsistent. | Medium | Added `state.verify` to `docs/LIFECYCLE_GUIDE.md`; full Docker sync-build passed. | Mitigated |
| Built CLI smoke wrapper failed under sandbox `spawnSync node` restrictions. | False validation failure could obscure actual CLI behavior. | Low | Reran built CLI commands directly to `/tmp` JSON files and parsed summaries separately. | Mitigated |
