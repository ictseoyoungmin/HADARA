# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0742 |
| Title | Clear retired state contracts and smoke routing drift |
| Status | In Progress |
| Created | 2026-07-29T23:14 |
| Updated | 2026-07-30T00:14 |

## Last Completed

| Item | Evidence |
|---|---|
| Retired global-state source contracts were removed from current `src/` behavior and current docs/read routing; `rg "PROJECT_STATE|AGENT_HANDOFF|.hadara/state/current.json" src` is clean. | ev:T-0742:8b3665e282ac474ba36f5d9c |
| Public-looking smoke registry/docs residue was corrected to the repo-local `node --import tsx tools/dev-surfaces.ts ...` surface. | ev:T-0742:dac14efe7f2d4f3cb8fa15ad |
| Full `npm run check` passed after the cleanup. | ev:T-0742:8b3665e282ac474ba36f5d9c |
| Clean-checkout smoke reached `npm ci` but was blocked in this sandbox by esbuild postinstall `spawnSync EPERM`; escalated rerun was unavailable due usage-limit rejection. | ev:T-0742:b8217fe938994c6191597997 |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Rerun `node --import tsx tools/dev-surfaces.ts smoke clean-checkout --execute --json` outside the restricted sandbox or in Docker/ext4, then update AC-5. | waiting-for-operator | no | The code and full check are green; the remaining unresolved item is environment-blocked clean-checkout smoke evidence. | tasks/T-0742-clear-retired-state-contracts-and-smoke-routing-drift/TASK.md; ev:T-0742:b8217fe938994c6191597997 |
| If clean-checkout passes, return to T-0741 and rerun its full validation/close path. | waiting-for-operator | no | T-0741 close-marker/argv work is ready to revalidate after this blocker is cleared. | tasks/T-0741-bind-close-marker-to-reviewed-plan-and-validate-full-surface/TASK.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not reintroduce public CLI routes for repo-local smoke/package/release developer surfaces. | That would undo the RC2 surface reduction. | Keep the public CLI compact and route HADARA-dev release tooling through `tools/dev-surfaces.ts`. |
| `tests/` still contains legacy/negative/compatibility fixtures mentioning `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and `.hadara/state/current.json`. | A literal `rg` over tests is not zero, even though current `src/` contracts are clean and full check passes. | Split a fixture-only cleanup capsule only if a reviewer requires zero textual legacy mentions in tests. |
| Clean-checkout smoke cannot be concluded in this sandbox. | `npm ci` fails on esbuild postinstall `spawnSync EPERM`; approval rerun was rejected by usage limit. | Rerun in approved sandbox-external execution or the reusable Docker/ext4 workflow. |
