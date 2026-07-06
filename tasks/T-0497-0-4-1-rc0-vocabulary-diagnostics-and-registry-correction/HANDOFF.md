# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Shared controlled vocabulary and `hadara schema` lookup are implemented for TASK.md, evidence, and docs registry tokens. | `ev:T-0497:76aba15e03a9492dbb139366` |
| `docs mark --correction` now supports guarded registry metadata corrections with structured diagnostics and `fieldDiff`. | `ev:T-0497:76aba15e03a9492dbb139366` |
| 0.4.1 rc0 scope, 0.5 state-first RFC, and historical 0.4.0 state-first proposal are registered in the docs registry. | `ev:T-0497:76aba15e03a9492dbb139366` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open the next `0.4.1-rc.0` capsule for either FD-010 (`task finalize --execute --auto`) or FD-011 command-surface drift gate. | T-0497 completed FD-006/FD-008/FD-009; FD-010 unblocks FD-013 lifecycle surface removal, while FD-011 protects future releases from dev/dist drift. | `docs/specs/0.4.1/rc0-scope.md`, `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host Vitest on `/mnt/f` still fails before test execution because the local `node_modules` optional rolldown native binding is missing. | Host focused test attempts are not reliable evidence for this line. | Use Docker ext4 validation; T-0497 Docker focused tests/build passed and refreshed `dist`. |
| `docs doctor` remains warning-only because many older project-specific docs are still unregistered. | T-0497 did not attempt broad historical docs cleanup. | Treat as pre-existing cleanup debt; new T-0497 docs are registered. |
