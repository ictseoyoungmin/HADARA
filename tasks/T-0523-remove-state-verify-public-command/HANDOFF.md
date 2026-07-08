# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Removed public `state.verify` command surface while preserving the internal `state-projection` service/schema and confirming `status` plus `protocol doctor` expose replacement advisory data. | `ev:T-0523:1ff663c8467b4e31b71002cc` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue command portfolio reduction from the T-0521 inventory, preferably another public surface whose replacement is already present. | The registry is now down to 68 current command ids. Avoid removing internal services that are still shared read models. | `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md`; `docs/COMMAND_SURFACE.md`; `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `status --json` is now the public state-consistency replacement but can be slow and very verbose on the mounted workspace. | It is correct for automation, but less comfortable as an interactive diagnostic replacement. | Local feedback is recorded in `.hadara/local/feedback/T-0523-status-state-consistency-latency.md`; consider a compact status/state-only follow-up. |
| `hadara.stateProjection.v1` remains an internal schema/service, not a removed data model. | Context/status/protocol consumers still depend on it. | Do not delete `src/services/state-projection.ts` or `src/schemas/state-projection.schema.json` unless those consumers are redesigned. |
