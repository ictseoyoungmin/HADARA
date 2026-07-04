# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `docs complete-spec` now exists as a dry-run-first, before-hash guarded registry mutation. | `ev:T-0495:e8d2f59d2c4348f0b2503b9a`, `ev:T-0495:85d467427c3d4142aa709bf7` |
| `hadara.docs.completeSpec.v1` schema fixture, command registry metadata, help output, and focused tests are in place. | `ev:T-0495:e8d2f59d2c4348f0b2503b9a`, `ev:T-0495:85d467427c3d4142aa709bf7` |
| Stable 0.4.0 usage feedback is recorded in the 0.4.1-rc.0 debt document with positives and FD-007 through FD-010. | `ev:T-0495:a5d3f212ed4b4e1fb80cf421` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement `docs.mark-drift` or fix the `handoff update` overwrite bug. | `docs.mark-drift` is the next planned docs-governance command, but stable feedback ranks handoff overwrite as the highest repeated friction. | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `docs.complete-spec` only supports registered `kind: spec` documents. | General registry correction still requires another capsule. | Use FD-008 for a broader correction path. |
| The command marks completed specs `status: historical` but keeps `readTier: implemented-reference`. | Current read-map treats explicit `implemented-reference` as read-if-needed; later Required Reading lifecycle work should confirm final routing semantics. | Handle under FD-003. |
