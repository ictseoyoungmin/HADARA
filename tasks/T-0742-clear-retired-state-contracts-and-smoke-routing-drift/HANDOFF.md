# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0742 |
| Title | Clear retired state contracts and smoke routing drift |
| Status | Done |
| Created | 2026-07-29T23:14 |
| Updated | 2026-08-01T16:30 |

## Last Completed

| Item | Evidence |
|---|---|
| Retired global-state source contracts were removed from current `src/` behavior and current docs/read routing; `rg "PROJECT_STATE|AGENT_HANDOFF|.hadara/state/current.json" src` is clean. | ev:T-0742:8b3665e282ac474ba36f5d9c |
| Public-looking smoke registry/docs residue was corrected to the repo-local `node --import tsx tools/dev-surfaces.ts ...` surface. | ev:T-0742:dac14efe7f2d4f3cb8fa15ad |
| Full `npm run check` passed after removing remaining retired-state fixtures; focused suite also passed 239 tests. | ev:T-0742:c2eead5b03a84763be90667b |
| Close dry-run was rechecked after AC-2 cleanup; only AC-5 clean-checkout smoke and final Done history remain blocked. | ev:T-0742:dd595efc202b4c5eabc3ee2a |
| Obsolete `markStateDocsCurrent()` fixture calls were removed from `task-close.test.ts`; the 57-test suite passed. | ev:T-0742:8c99e66968c74cb7b2e03b0e |
| Host clean-checkout smoke passed with full check, built CLI doctor/status, strict release gate, cleanup, and reduced public evidence attachment. | ev:T-0742:a15c69b19321422796f1661e |
| Clean-checkout smoke reached `npm ci` but was blocked in this sandbox by esbuild postinstall `spawnSync EPERM`; escalated rerun was unavailable due usage-limit rejection. | ev:T-0742:b8217fe938994c6191597997 |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Return to T-0741 and rerun its full validation/close path. | waiting-for-operator | no | T-0741 close-marker/argv work is ready to revalidate now that host clean-checkout smoke passes. | tasks/T-0741-bind-close-marker-to-reviewed-plan-and-validate-full-surface/TASK.md; ev:T-0742:a15c69b19321422796f1661e |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not reintroduce public CLI routes for repo-local smoke/package/release developer surfaces. | That would undo the RC2 surface reduction. | Keep the public CLI compact and route HADARA-dev release tooling through `tools/dev-surfaces.ts`. |
| `tests/unit/docs-registry.test.ts` still contains retired path literals. | These are explicit negative regressions proving retired paths are not registered or read as current docs; they are not continuation fixtures. | Preserve as named retirement/compatibility checks unless the registry regression is moved to a separately scoped compatibility suite. |
| Earlier sandbox clean-checkout attempt was environment-blocked. | It is historical evidence only; the host rerun passed all smoke steps. | Use `ev:T-0742:a15c69b19321422796f1661e` as the current AC-5 proof. |
