# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0327 |
| TaskStatus | Done |
| Last Updated | 2026-06-16 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| `hadara@0.3.1-rc.1` was published to npm and registry/tarball visibility is confirmed. | `command:T-0327:npm-publish`; `command:T-0327:registry-tarball-verify` |
| The manual publish helper now defaults rc versions to npm tag `next` and stable versions to `latest`. | `command:T-0327:manual-publish-tag-hardening` |
| Registry dist-tags were corrected so stable remains `latest` and rc1 is available as `next`. | `command:T-0327:npm-dist-tag-corrected` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0328 post-publish installed-package recycle. | npm publish, registry/tarball visibility, and dist-tag correction are complete; the next capsule should validate the installed package from consumer paths. | `tasks/T-0328-0-3-1-rc-1-post-publish-installed-package-recycle/TASK.md`, `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| T-0328 should use consumer install paths, not the source checkout, as primary proof. | T-0327 proves publish and tags only; installed behavior still needs package recycle evidence. | Use isolated temp-prefix installed-bin proof per `docs/TEST_STRATEGY.md`, then fresh init/migration/lifecycle smokes as scoped by T-0328. |
