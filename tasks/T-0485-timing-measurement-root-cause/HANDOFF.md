# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| T-0479 negative timing values were traced to the dogfood harness, not to the published CLI output path itself. The harness used separate `Date.now()` Node processes before and after each command, so wall-clock adjustment could produce negative elapsed values. | `ev:T-0485:c2aaa91b5fa74d5bb063085d` |
| `run_flowforge_dogfood.sh` now uses `process.hrtime.bigint()` with nonnegative clamping, and current CLI elapsed-time helpers now use `startMonotonicTimer()` over `performance.now()`. | `ev:T-0485:c541e1fabdc54b35a1be92e5` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open task id counter after manual capsule deletion. | This is the next required pre-stable capsule after timing root-cause cleanup. | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The original T-0479 dogfood report still contains historical negative durations. | Do not treat those values as current CLI timing behavior. | Use T-0485 evidence as the correction record; rerun dogfood only if stable readiness requires fresh installed-package timing. |
| A direct mounted-workspace `validation run` smoke was blocked by sandbox `spawnSync node EPERM`. | The blocked record remains in T-0485 evidence. | It is resolved by container ext4 validation evidence `ev:T-0485:c541e1fabdc54b35a1be92e5`. |
| User-facing timing footers remain out of scope. | Operators still need an external report or JSON diagnostics for broad command timing analysis. | Keep the optional timing footer as a post-stable candidate unless output UX work pulls it forward. |
