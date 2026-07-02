# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Release closeout now checks current capsule surfaces only: `TASK.md`, `EVIDENCE.md`, and `HANDOFF.md`. | ev:T-0472:464654f09f824d09ad4e6a4e |
| State projection and harness Done-level plan drift checks read current `TASK.md` Plan when legacy `PLAN.md` is absent. | ev:T-0472:464654f09f824d09ad4e6a4e, ev:T-0472:ddf2c1f180054178b95a26a1 |
| Operational debt and evidence lint now use current `TASK.md` Acceptance / Risks sections as fallback documentation. | ev:T-0472:464654f09f824d09ad4e6a4e |
| TUI task detail favors current capsule files first while keeping legacy sidecar tabs available. | ev:T-0472:ddf2c1f180054178b95a26a1 |
| Docker TypeScript build passed and `/workspace/dist` was refreshed. | ev:T-0472:758500c96600471bb12c7bb8 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Decide between global docs/profile diagnostics performance and compatibility-only sidecar cleanup. | Current user-facing/read-model sidecar assumptions are cleaned up; remaining references are mostly historical specs, old compatibility fixtures, migration/template paths, or broad diagnostics performance. | `docs/AGENT_HANDOFF.md`, `.hadara/context/MEMORY.md`, `tasks/T-0472-legacy-sidecar-reference-audit/TASK.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical specs and compatibility tests still mention old sidecars. | Bulk-editing them would create churn and erase useful compatibility history. | Only change those references when they affect current generated/user-facing behavior. |
| `task status --json` no-task recommendation can still read stale `Next Recommended Step` prose if AGENT_HANDOFF is not refreshed. | Agent may see an older performance task title despite the Active / Next row being current. | Keep AGENT_HANDOFF current before stopping; prefer the Active / Next Task row when rows and prose diverge. |
