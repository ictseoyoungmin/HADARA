# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `validation run` now tags validation evidence with a stable `validation-check:<key>` and returns attempt metadata in `hadara.validation.run.v1`. | `ev:T-0454:10fe55713fac48b2907d76b6` |
| Passing the same validation check now auto-adds `resolves:<id>` for prior unresolved failed or blocked attempts from that check. | `ev:T-0454:385fa69b38dc4641839a69bb` resolves `ev:T-0454:f3a4b2dfcbdd44b39c90d9f6` |
| Workflow guidance and command registry text now describe the attempt auto-resolution behavior. | `ev:T-0454:0287e6d080ec411880afc44b` |
| Done-level harness validation passed directly after wrapper attempts were blocked by nested spawn EPERM. | `ev:T-0454:fe8b5a505bd94cbaa6805dc4` resolves `ev:T-0454:e0c6c2bdd8184cd4a13d245e`, `ev:T-0454:f48ea70b5ca34161897c7b79` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open the next agent UX capsule for validation latest-attempt projection and wrapper/help UX repair triage. | T-0454 reduces repair tagging, but agents still need compact current validation state; this capsule also exposed nested spawn EPERM handling and `evidence add-command --help` recording default evidence. | `tasks/T-0454-agent-ux-validation-attempt-auto-resolution/TASK.md`, `src/services/validation-run.ts`, `src/services/task-workbench.ts`, `src/services/evidence-list.ts`, `src/cli/evidence.ts` |
| Keep 0.4 release-line work separate unless the operator explicitly starts a release capsule. | The active objective is the 5-15 capsule agent UX refactor dogfood loop, not release readiness or publishing. | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Attempt auto-resolution is intentionally same-check only. | Cross-check or non-validation repair relationships still need explicit `--resolves` or `--supersedes` markers. | Use exact explicit markers for non-obvious repair relationships. |
| Raw evidence is still the only detailed latest-attempt source. | Agents can see resolved residuals, but they still do extra lookup work to answer "what is the current validation state?" | Address this in the next UX capsule with a latest-attempt projection. |
| `validation run` wrapper execution can fail with nested spawn EPERM in this environment even when the direct command passes. | Final harness evidence may need direct execution plus `evidence add-command` until the wrapper semantics are hardened. | Treat `ev:T-0454:fe8b5a505bd94cbaa6805dc4` as the final direct harness proof for this capsule. |
| `evidence add-command --help` recorded default evidence during T-0454. | Help access can accidentally mutate evidence and create weak records. | Fix command help parsing or add a global help guard in a future UX capsule. |
