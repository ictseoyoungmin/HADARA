# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| rc0-scope items 5 and 6: `.hadara/state/slices.json` slices-state prototype with ownership-contract drift guard (FD-012), and removal of the standalone `task finish`/`ready`/`close`/`audit-close`/`complete`/`lifecycle` surface behind `hadara.commandRemoved.v1` deprecation stubs (FD-013, six commands including `task lifecycle` per explicit follow-up instruction). Docker full suite 1033/1033. | `ev:T-0500:ef6aa0705a59470099f4de99`, `ev:T-0500:b49ef2fac40b43f080c96671`, `ev:T-0500:250d41efcb9d42c19b6dce6c` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| The `docs/specs/0.4.1/rc0-scope.md` implementation budget (items 1-6) is now complete. Release smoke / actual `0.4.1-rc.0` tagging was explicitly out of scope for this work and was not run. Before tagging, resolve AC-6's partial state (dogfood 2+ real capsules with slices state, or file the explicit-exclusion note rc0-scope permits for item 5) and consider RF-1 (migrate id-derivation for non-`id: title` legacy tables). | Completes the rc0 release-readiness gate per `docs/specs/0.4.1/rc0-scope.md` 릴리스 판정. | `docs/specs/0.4.1/rc0-scope.md`, `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `slice migrate`'s id derivation (first token before `:`/`\|` in the Slice cell) assumes the `id: title` convention; HADARA-dev's own 414-row `DEVELOPMENT_SLICES.md` predates it and would collide on migrate. | Do not run `hadara slice migrate --execute` against HADARA-dev's real `docs/DEVELOPMENT_SLICES.md` until the id-derivation fallback (RF-1) is fixed. | Documented in T-0500 TASK.md RF-1; real-file dry-run evidence recorded as `ev:T-0500:525c1b2552ce4726af350b63`. |
| The `doctor` `slices-projection` check only activates once `.hadara/state/slices.json` exists, so it is silent on projects (including HADARA-dev itself) that haven't adopted the prototype. | No false nagging on non-adopters, but also no reminder to adopt. | Intentional — item 5 is an opt-in prototype pending the 0.5 RFC gate decision, not a mandatory migration. |
| The five stub commands (`finish`/`ready`/`close`/`audit-close`/`complete`) plus `task lifecycle` are kept as redirect stubs for at least one minor release, not deleted outright. | Any external tooling still calling them gets a structured `TASK_LIFECYCLE_COMMAND_REMOVED` error (exit 6) instead of silent breakage, but the surface still technically exists in the registry. | RF-3 recommends scheduling the hard-removal capsule once 0.4.1 ships. |
