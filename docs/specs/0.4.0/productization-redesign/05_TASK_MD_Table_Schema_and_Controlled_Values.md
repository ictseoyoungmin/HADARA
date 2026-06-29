# 05 TASK.md Table Schema and Controlled Values

## Goal

Treat Markdown tables as small schema surfaces.

Agents may author prose, but controlled fields must use exact tokens. This keeps Markdown flexible while making validation deterministic.

Section-level authoring guidance belongs in `docs/HADARA_WORKFLOW.md` and the slot/table registries. Generated `TASK.md` files should not repeat long instructional comments or an ownership table in every capsule.

## Field Classes

| Class | Meaning | Examples |
|---|---|---|
| CLI-owned canonical field | Only HADARA CLI owns the value. | Task ID, Created, evidence IDs, close proof. |
| Controlled token field | Agent may set the value, but only from a predefined token set. | Status, Required, Disposition, Result, Read Tier. |
| Agent-derived prose | Agent writes free text derived from user instructions and design source documents. | Goal, Acceptance criterion, Plan action, Risk summary, Follow-up summary. |
| Design source prose | Human or agent-authored design source document content. | `docs/specs/**` specs, product briefs, design notes. |
| Projection field | Generated from canonical state. | `EVIDENCE.md` summaries, close proof projection. |

## Canonical TaskStatus

Owner: `TASK.md` `task.identity` managed slot.

Allowed values:

```text
Draft
In Progress
Blocked
Done
Partial
Superseded
Archived
```

Forbidden as TaskStatus:

```text
Closed
Ready
Approved
Complete
closed-valid
not-closed
Done pending close
```

## CloseState

Derived only. Never manually written into `TASK.md` or `HANDOFF.md`.

Allowed derived values:

```text
not-closed
closed-valid
closed-stale
closed-invalid
unknown
```

## `TASK.md` Identity

```md
## Identity

<!-- hadara:slot task.identity -->
| Field | Value |
|---|---|
| ID | T-0001 |
| Title | Add dashboard action busy guard |
| Status | Draft |
| Created | 2026-06-29 |
| Updated | 2026-06-29 |
<!-- /hadara:slot -->
```

No `Layout` field exists in 0.4.

## Source Documents

```md
## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
```

Controlled values:

| Column | Values |
|---|---|
| `Role` | `implementation-source`, `reference`, `constraint`, `decision`, `background` |
| `Authority` | `exploratory`, `proposed`, `approved`, `normative`, `implementation-source`, `reference-only`, `historical` |
| `Status` | `draft`, `review`, `approved`, `implementing`, `implemented`, `superseded`, `drift-risk`, `archived` |
| `Source Hash` | `sha256:<hex>` or `TBD` before first interpretation |

## Plan

```md
| Step | Action | Status | Evidence |
|---|---|---|---|
```

Allowed `Status`:

```text
Pending
In Progress
Done
Blocked
Skipped
```

## Acceptance

```md
| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
```

Controlled values:

| Column | Values |
|---|---|
| `ID` | `AC-1`, `AC-2`, ... |
| `Required` | `Yes`, `No` |
| `Status` | `Pending`, `Met`, `Not Met`, `Blocked`, `Not Applicable` |
| `Disposition` | `Required`, `Optional`, `Deferred`, `Accepted Risk`, `Not Applicable`, `Superseded` |

Rules:

```text
Required + Pending/Not Met/Blocked blocks done-level readiness.
Deferred requires a follow-up reference.
Accepted Risk requires a risk or follow-up reference.
Superseded requires a replacement reference.
Not Applicable requires a reason or reference.
```

## Validation

```md
| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
```

Allowed `Latest Result`:

```text
Not Run
Passed
Failed
Blocked
Skipped
Not Applicable
```

## Change Summary

```md
## Change Summary

Line ranges are recorded against the final implementation state used for finalize review.

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
```

Allowed `Lines` formats:

```text
L10-L20
L10-L20, L44-L51
whole-file
new-file
deleted-file
N/A
```

Rules:

```text
Line ranges must be final-state line ranges.
Generated files may use N/A with a reason.
Deleted files use deleted-file.
Whole-file rewrites use whole-file.
```

## Risks / Follow-ups

```md
| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
```

Allowed values:

| Column | Values |
|---|---|
| `Kind` | `Risk`, `Follow-up`, `Question` |
| `State` | `Open`, `Accepted`, `Mitigated`, `Deferred`, `Closed`, `Superseded`, `Rejected` |

Durable project-level decisions belong in the project decision log or an approved design source document. The default Task Capsule does not carry a task-local `Decision` kind.

## Diagnostics

Validators should report:

```text
TASK_STATUS_DUPLICATE_OWNER
TASK_STATUS_INVALID_TOKEN
TASK_CLOSE_STATE_PERSISTED_IN_TASK
TASK_CLOSE_STATE_PERSISTED_IN_HANDOFF
TASK_CLOSE_PROOF_IN_CLOSE_SOURCE
TASK_SOURCE_DOCUMENT_CHANGED
TASK_SOURCE_DOCUMENT_MISSING_HASH
ACCEPTANCE_STATUS_INVALID_TOKEN
ACCEPTANCE_DISPOSITION_REFERENCE_MISSING
VALIDATION_RESULT_INVALID_TOKEN
CHANGE_SUMMARY_LINE_RANGE_MISSING
CHANGE_SUMMARY_LINE_RANGE_INVALID
```
