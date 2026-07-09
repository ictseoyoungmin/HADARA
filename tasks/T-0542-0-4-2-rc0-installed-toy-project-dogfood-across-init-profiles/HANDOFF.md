# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Installed `hadara@next` as `0.4.2-rc.0` in an isolated `/tmp` prefix and dogfooded all init profiles. | `ev:T-0542:7c7aae7945b94710821bcd45` |
| Completed governed-profile Taskflow Toy through T-0001, T-0002, and T-0003 using generated workflow docs. | `ev:T-0542:7c7aae7945b94710821bcd45` |
| Copied structured dogfood report into `artifacts/DOGFOOD_REPORT.md`. | `ev:T-0542:7c7aae7945b94710821bcd45` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Fix installed-package context-pack source-checkout leakage. | Consumer projects should not see missing HADARA source file warnings from npm installs. | `artifacts/DOGFOOD_REPORT.md` |
| Add empty-project first-task guidance. | `basic` and `standard` fresh projects return no next actions from `task status --json`. | `artifacts/DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `context pack` in installed consumer projects warns about `src/services/capability-registry.ts` and `docs/RELEASE_READINESS.md`. | Context routing looks degraded even when the installed package is healthy. | Treat source-checkout projections as source-only, or provide package-safe metadata fallback. |
| Handoff recommendation matching can suggest duplicate task creation when title wording differs from an existing open task. | Agents may create duplicate capsules from semantically identical handoff prose. | Prefer open Task Board rows or require task ids in generated handoff recommendations. |
