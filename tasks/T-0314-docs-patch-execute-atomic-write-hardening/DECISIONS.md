# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `atomicWriteTextFile()` for `docs patch --execute`. | Accepted | This reuses the shared temp+rename helper and containment guard already used by migration/docs cleanup writes. | `src/services/managed-sections.ts`; `command:T-0314:validation` |
| D-2 | Keep `hadara.docs.patchPlan.v1` and add only a write-failure issue. | Accepted | The existing schema already carries issues; no breaking report shape is needed. | `MANAGED_PATCH_WRITE_FAILED` regression coverage. |
| D-3 | Fix stale README rc.1 expectations in `init.test.ts`. | Accepted | Full validation must reflect the already-published rc.2 README state from T-0310/T-0312. | Docker full check passed after update. |
