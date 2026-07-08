# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Removed public `proof.status`, `proof.explain`, `evidence.summary`, and `ci.gate` command surfaces, including registry/help/schema/docs/tests cleanup. | `ev:T-0522:9f87a75fe15649e9bd445710` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue command portfolio reduction with the next candidate slice from T-0521. | The public command surface is now down to 69 registry ids; the next reduction should use the inventory instead of opportunistic one-off removal. | `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md`; `docs/COMMAND_SURFACE.md`; `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical docs and old task capsules still mention the removed commands. | Broad search will still find the old command names in history, release notes, and compatibility records. | Treat current registry/help/init/docs as authoritative; do not mass-edit historical records unless they affect current generated guidance. |
| Removed command calls now hit normal unknown-command behavior. | This was intentional complete removal, not a one-minor redirect-stub path. | Use `task status --detail full`, `task finalize --json`, `evidence list`, `state verify`, or release-specific `release gate` depending on the old workflow intent. |
