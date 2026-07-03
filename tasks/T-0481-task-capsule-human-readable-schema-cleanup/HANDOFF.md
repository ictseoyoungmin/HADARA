# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Added `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` with pre-stable required capsules and promotion gates. | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| Updated new Task Capsule scaffolds to the v2 human-readable order and column names. | ev:T-0481:15f0b359a90e4732b10c6e5a |
| Preserved v1 TASK.md compatibility across harness validation, acceptance readiness, validation-run row sync, task authoring guidance, and workbench suggestions. | ev:T-0481:d7ea70a9e2a2468a95aca229 |
| Refreshed workspace `dist` and verified built CLI smoke. | ev:T-0481:8820c76990b947f2bf0e3a4c |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open the next required pre-stable capsule from `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md`. | JSON `taskId` envelope hardening is the next highest-priority stable-blocking dogfood friction. | docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical specs and older capsules still show the v1 0.4 TASK.md table names. | This is expected compatibility history, but docs readers may see both shapes. | Treat v2 as the new scaffold default; update broader docs/spec examples in a dedicated docs pass if stable release notes require it. |
| `dashboard.bootstrap` now redacts artifact paths in compact aggregate output. | The compact first-paint report stays path-safe, but operators needing exact artifact paths must use task/evidence-specific read models. | Keep exact paths in task/evidence surfaces, not the aggregate bootstrap payload. |
