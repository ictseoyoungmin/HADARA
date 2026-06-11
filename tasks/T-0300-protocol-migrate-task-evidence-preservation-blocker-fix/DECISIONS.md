# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use a create-if-missing helper for task evidence instead of extending generic `planWrite`. | Accepted | Existing evidence preservation is a sharper invariant than generic content sync; the task evidence path should never use update semantics. | `src/services/protocol-migration.ts`; focused regression. |
| D-2 | Keep batch-transactional migration hardening out of T-0300. | Accepted | The blocker is evidence erasure; per-file hash guards remain unchanged and broader transactional behavior should be handled in a future hardening capsule if needed. | Reviewer feedback classified this as non-blocking follow-up. |
| D-3 | Fold the `task finish` Status History table hotfix into T-0300 before commit. | Accepted | It is another release-blocking workflow integrity bug found before the blocker-fix commit, and the same capsule is already in flight. | Screenshot review; `tests/unit/task-finish.test.ts`. |
