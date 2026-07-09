# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| T-0551 Implement known-problem and handoff extraction cleanup | `extractAgentHandoff` now filters stateful `Current Known Problems` rows to active/current/open/watch states, `docs/AGENT_HANDOFF.md` separates current active problems from historical carried-forward notes, and built context-pack smoke returned 4 active known-problem nodes with `releaseState:"current"` and `stateConsistency:"consistent"`. Evidence: `ev:T-0551:8b2c9ddd3af9492aaa8e400b`, `ev:T-0551:3089ff9c45d5430f871777d6`, `ev:T-0551:daa5ba4a617844c5872de48e`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement cache and extractor freshness cleanup. | This is the next item in the requested order after handoff extraction cleanup and should address T-0548 stale extractor/cache shard findings. | `tasks/T-0548-context-pack-freshness-diagnostic/CONTEXT_PACK_DIAGNOSTIC.md`, `docs/AGENT_HANDOFF.md`, `src/context/` cache/extractor code. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Task-scoped live `context pack` remains slow and cache-degraded on mounted workspaces. | T-0551 reduced stale known-problem content but did not address cache/extractor freshness or graph latency. | Keep using bounded task/status/session paths by default; handle cache freshness in the next capsule. |
| Code graph and docs registry routing cleanup remain open. | Context packs still lack code-index nodes and may include overly broad docs until later requested capsules. | Keep those as separate follow-up capsules after cache/extractor freshness. |
