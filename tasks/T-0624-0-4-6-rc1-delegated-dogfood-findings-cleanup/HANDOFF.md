# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Governed/minimal profile diagnostics no longer require optional docs absent by design. | `ev:T-0624:db6bea4aef7543ac804489b0` |
| Generated workflow and task scaffold now warn agents not to hand-edit lifecycle-owned status fields. | `ev:T-0624:73a022a3a7144cc1b9131563` |
| Generated workflow includes package-manager-neutral `--no-bin-links` direct Node entrypoint fallback guidance. | `ev:T-0624:73a022a3a7144cc1b9131563` |
| Docker sync-build refreshed workspace `dist` and built CLI smoke passed. | `ev:T-0624:b866deb7bb2646abb9bb4187` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Re-run 0.4.6 rc/stable release readiness from the updated source state. | T-0620 readiness evidence is stale after T-0621 and T-0624 code/doc changes. | `tasks/T-0620-0-4-6-rc-1-release-readiness-and-publish-preparation/TASK.md`, this `TASK.md`, `docs/HADARA_WORKFLOW.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| T-0620 release readiness evidence predates later changes. | Do not promote 0.4.6 stable from T-0620 evidence alone. | Run a fresh release readiness capsule/helper against the current source. |
| Generated docs use normal `hadara ...` commands even when an environment needs direct Node entrypoint fallback. | Delegated agents in no-bin-links environments may still need operator-provided invocation prefix. | Use the new Installed Package Fallback section; broader configurable command-prefix work remains out of this capsule. |
