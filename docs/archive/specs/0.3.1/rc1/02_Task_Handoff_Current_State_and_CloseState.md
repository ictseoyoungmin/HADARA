# rc1 Capsule 2 - Task Handoff Current-State and CloseState

## Capsule Goal

Make task-local handoff current-state less ambiguous while keeping close proof state derived from read models instead of persisted in close-source handoff docs.

## Scope

| In Scope | Notes |
|---|---|
| Update new task handoff scaffold to prefer `TaskStatus` only. | Preserve legacy compatibility while avoiding close-source fixed-point drift. |
| Add done-level validation for stale pending-close wording. | Start with high-confidence phrases. |
| Add done-level validation for `PLAN.md` rows still marked `In Progress` when task status is Done. | This directly addresses T-0316/T-0317 drift. |
| Add fix hints to validation issues. | Workers should know exactly what to edit. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `audit-close` writing Markdown. | Audit remains read-only. |
| Broad NLP linting. | Too noisy. |
| Historical mass migration. | Future dry-run-first task. |

## Files Likely to Change

```text
src/task/create.ts or task template sources
src/harness/validate.ts or task validation service
src/task/ready.ts or ready report adapter
tests/unit/harness-validate.test.ts
tests/unit/task-ready.test.ts
```

## Issue Codes

```text
TASK_HANDOFF_STATUS_DRIFT
TASK_HANDOFF_CLOSE_STATE_PERSISTED
TASK_PLAN_STATUS_DRIFT
```

## Tests

```bash
npm run test:focused -- tests/unit/harness-validate.test.ts tests/unit/task-ready.test.ts tests/unit/task-create.test.ts
npm run dev:docker-sync-build
git diff --check
```

## Done Criteria

| ID | Criterion |
|---|---|
| DC-1 | New handoff scaffold persists TaskStatus only and documents CloseState as derived read-model state. |
| DC-2 | Done-level validation detects `pending lifecycle close` wording in active task handoff. |
| DC-3 | Done-level validation detects `PLAN.md` In Progress rows after Done. |
| DC-4 | Validation issues include path and fixHint. |
