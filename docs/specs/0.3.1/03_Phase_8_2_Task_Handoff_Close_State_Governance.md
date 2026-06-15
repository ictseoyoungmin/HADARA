# Phase 8.2 - Task Handoff Close-State Governance

## Status

Planned implementation specification.

## Problem

T-0317 exposed a practical workflow gap:

```text
task close/audit evidence was valid, but task-local HANDOFF.md still said
"Done pending lifecycle close".
```

The CLI correctly appended and audited close proof, but it did not validate the human-facing managed current-state wording.

## Goal

Make task-local handoff current-state explicit enough that workers and validators can distinguish persistent task status from derived close state.

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Make `audit-close` mutate Markdown. | `audit-close` remains read-only. |
| Rewrite historical handoffs. | Historical records are preserved unless a specific migration is approved. |
| Add broad natural-language linting. | Use structured fields and small denylist checks first. |
| Make close proof depend on handoff prose. | Close proof remains evidence/audit based. |

## Desired Managed Section Shape

New or upgraded task-local `HANDOFF.md` current-state sections should prefer:

```md
| Field | Value |
|---|---|
| Task | T-XXXX |
| TaskStatus | Done |
| CloseState | closed-valid |
| Status Note | Latest audit-close returned closed-valid. |
| Last Updated | YYYY-MM-DD |
```

Compatibility rule:

```text
Existing `Status` rows are accepted during rollout, but `task ready` or harness validation
should warn when a Done task's handoff contains pending-close wording.
```

## Validator Rules

Minimum warning rules:

| Rule | Severity | Rationale |
|---|---|---|
| Done task plus handoff phrase `pending lifecycle close` | warning initially, future error | This phrase is stale after close/audit. |
| Done task plus `PLAN.md` row still `In Progress` | error for done-level readiness | Plan drift is close-source drift. |
| Handoff has `CloseState` outside allowed set | warning initially | Rollout should not break historical tasks. |
| Handoff has `TaskStatus` outside allowed set | warning initially | Prevent schema drift without mass migration. |

Candidate issue codes:

```text
TASK_HANDOFF_STATUS_DRIFT
TASK_HANDOFF_CLOSE_STATE_INVALID
TASK_PLAN_STATUS_DRIFT
TASK_STATUS_TOKEN_RESERVED
```

## CLI Behavior

Recommended behavior:

| Command | Behavior |
|---|---|
| `task create` | Generate the new current-state shape once the template is updated. |
| `task finish --execute` | May update `TaskStatus` to `Done` if the managed section has the new field. |
| `task ready --level done` | Warn or block on stale pending-close wording and plan drift. |
| `task close --execute` | May update managed `CloseState` only if a dedicated bounded managed patch is implemented; otherwise leave to future handoff update. |
| `task audit-close` | Read-only; reports drift if detected but does not write. |

Minimal rc1 implementation can avoid `task close` writes and rely on validation warnings plus updated templates.

## Worker Ergonomics

The worker should be able to answer these questions without interpreting prose:

```text
Is the task itself Done?
Is the latest close proof valid?
Is the handoff current-state section stale?
Which command should fix it?
```

The report should provide a concrete fix hint:

```text
Replace `Status | Done pending lifecycle close` with `TaskStatus | Done`
and `CloseState | closed-valid` after audit-close returns closed-valid.
```

## Tests

Focused tests should cover:

```text
Done task + HANDOFF pending lifecycle close produces drift issue.
Done task + PLAN In Progress produces done-level blocker.
Clean TaskStatus Done + CloseState closed-valid passes.
Existing legacy Status row remains warning-only unless stale phrase is present.
```

Recommended commands:

```bash
npm run test:focused -- tests/unit/harness-validate.test.ts tests/unit/task-ready.test.ts tests/unit/task-close.test.ts
git diff --check
```

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | New handoff current-state shape is documented. |
| AC-2 | Done-level validation detects stale pending-close handoff wording. |
| AC-3 | Done-level validation detects remaining `PLAN.md` In Progress rows. |
| AC-4 | Compatibility behavior for legacy `Status` rows is documented. |
| AC-5 | `audit-close` remains read-only. |
