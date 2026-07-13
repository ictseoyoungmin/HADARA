# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Stable `0.4.4` is published and installed-package recycled through T-0584. | `tasks/T-0584-v0-4-4-operator-publish-and-installed-package-recycle/EVIDENCE.md` |
| 0.4.5 design scope is docs registry schema/UX cleanup plus init `tasks/.gitkeep` policy. | `ev:T-0585:cb388a23ed194ba6a16c229d` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start the first implementation capsule: init upgrade project identity preservation and `tasks/.gitkeep` generation cleanup. | The design identifies this as the smallest recurrence-prevention capsule before full docsRegistry v3. | `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `docs register` can add entries but cannot update/archive/supersede/unregister existing entries yet. | Some registry cleanup still requires raw JSON until 0.4.5 implementation lands. | Keep this design explicit and implement safe mutation commands before broad manual cleanup. |
| `projectProfile` currently mixes local identity and HADARA scaffold profile. | `init upgrade --profile governed` can overwrite `hadara-dev` identity. | Treat as 0.4.5 implementation capsule, not this design-only capsule. |
