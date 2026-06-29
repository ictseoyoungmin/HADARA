# 08 Project State, Task Board, and Handoff

## Goal

Prevent shared state docs from duplicating canonical task state or becoming historical logs.

## `PROJECT_STATE.md`

Basic and standard projects use `PROJECT_STATE.md` for compact project state and continuation.

Recommended sections:

```text
Product
Current State
Active Work
Last 3 Completed Tasks
Current Known Problems
Next Recommended Step
Historical Index
```

Rules:

```text
Do not store per-acceptance task details here.
Do not store close proof here.
Do not turn this into a full project history log.
If `AGENT_HANDOFF.md` exists, `PROJECT_STATE.md` summarizes project state and does not own session continuation details.
```

## `TASK_BOARD.md`

`TASK_BOARD.md` is a task index.

Recommended columns:

```md
| ID | Title | Status | Capsule | Notes |
|---|---|---|---|---|
```

Rules:

```text
Status is an index/projection of canonical TASK.md status.
Notes is free-text and must not be used for close-source integrity.
The full TASK_BOARD.md file must not be included in close-source hash.
Close may perform a consistency check against the task board row.
```

Recommended consistency check:

```json
{
  "taskBoardConsistency": {
    "checked": true,
    "taskId": "T-0001",
    "statusMatchesTaskIdentity": true,
    "capsulePathMatches": true
  }
}
```

## `AGENT_HANDOFF.md`

Generated only for governed / long-running projects.

Role:

```text
session continuation
current handoff warnings
last completed tasks
historical index
```

It must not store:

```text
canonical TaskStatus
CloseState
close proof
full task acceptance
full validation history
```

## Task-Local `HANDOFF.md`

Task-local `HANDOFF.md` contains:

```text
Last Completed
Next Recommended Step
Carry Forward Warnings
```

Task-local `Next Recommended Step` must point to the next capsule-level action or project/global-state recommendation. It must not describe same-capsule lifecycle chores such as running validation, filling acceptance, appending evidence, or finalizing the current task.

Recommended table:

```md
## Carry Forward Warnings

| Warning | Type | Impact | Follow-up |
|---|---|---|---|
```

Allowed warning types:

```text
Blocker
Risk
Follow-up
Context
Validation
Release
Security
```

Task-local `HANDOFF.md` is continuation guidance, not proof. It is excluded from the default close-source hash so agents can clarify next-step guidance after close without making the task contract stale. It must still avoid canonical TaskStatus, CloseState, close proof, duplicated identity fields, full acceptance state, or raw validation history.

If a future governed profile needs immutable task-local handoff, that must be an explicit close-source profile with clear warnings before close. It is not part of the default 0.4 scaffold.

## Diagnostics

```text
PROJECT_STATE_TOO_HISTORICAL
PROJECT_STATE_DUPLICATES_TASK_ACCEPTANCE
TASK_BOARD_STATUS_DRIFT
TASK_BOARD_WHOLE_FILE_CLOSE_SOURCE
HANDOFF_TASK_STATUS_PERSISTED
HANDOFF_CLOSE_STATE_PERSISTED
HANDOFF_CLOSE_PROOF_PERSISTED
TASK_HANDOFF_IDENTITY_DUPLICATION
TASK_HANDOFF_INCLUDED_IN_CLOSE_SOURCE_BY_DEFAULT
```
