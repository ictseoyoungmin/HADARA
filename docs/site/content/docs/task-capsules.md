---
id: task-capsules
group: Core model
label: Task Capsules
short: The durable unit the agent carries between sessions.
eyebrow: Work unit
title: One task. One bounded contract. One handoff.
lead: A Task Capsule carries the information another agent needs to resume the same work without replaying the entire project history. Humans can review it; agents are expected to keep it current.
callout: A Task Capsule is protocol state, not a form the human must manually maintain during ordinary agent-driven work.
audience: shared
order: 5
---

## 01 · Scope
### Keep the work bounded
The capsule explains what this task changes, what it deliberately leaves alone, and which sources constrain implementation.

## 02 · Verify
### Acceptance points to evidence
Required acceptance criteria must have satisfying evidence or an explicit reviewed residual disposition.

## 03 · Handoff
### Continuation survives the session
Pre-close action is different from post-close continuation. A closed task must not leave same-task chores pretending to be next work.

## Who maintains the capsule?

The coding agent normally creates or resumes the capsule and keeps its task-owned content current as it works. The human may review or deliberately edit human-owned prose, but should not need to drive the lifecycle by manually issuing Task Capsule commands.

A capsule includes the task contract plus task-local handoff and evidence surfaces. The canonical evidence log is append-only `evidence.jsonl`; `EVIDENCE.md` is its human-readable projection.

## Capsule anatomy

```text
tasks/T-0042-fix-retry-backoff/
├── TASK.md         bounded task contract and close summary source
├── HANDOFF.md      pre-close state, post-close continuation, warnings
├── evidence.jsonl  canonical append-only evidence
└── EVIDENCE.md     generated human-readable projection
```

Those labels summarize responsibility; they are not a shortened section inventory. A fresh `task create` produces the following structure:

| Surface | Sections or initial content created immediately |
|---|---|
| `TASK.md` | `Identity`, `Goal`, `Scope`, `Plan`, `Acceptance`, `Validation`, `Inputs / Constraints`, `Changes`, `Risks / Follow-ups`, blank `Close Summary`, and `History`. |
| `HANDOFF.md` | `Identity`, `Last Completed`, `Pre-Close Operator Action`, `Post-Close Continuation`, and `Carry Forward Warnings`. The initial post-close row is `terminal/no`; the other task-owned rows still contain placeholders. |
| `evidence.jsonl` | An empty append-only file. Evidence commands append canonical records later; the agent does not seed or hand-edit it. |
| `EVIDENCE.md` | Empty generated tables for `Validation Evidence`, `Close Proof`, and `Failed / Blocked / Residual Evidence`, each inside managed projection slots. |

`task create` also appends the project-level Task Board row. Without an explicit target it begins as:

```markdown
| ID | Title | Status | Targets | Capsule | Result |
|---|---|---|---|---|---|
| T-0042 | Fix retry backoff | Draft | project | tasks/T-0042-fix-retry-backoff | - |
```

The Task Board is outside the capsule because it indexes every capsule. `Targets` is fixed from the task-create input, while `Result` remains `-` until valid close projects the capsule's `Close Summary`.

| Surface | Agent responsibility | Human review |
|---|---|---|
| `TASK.md` | Keep the bounded contract and progress current. | Confirm that the intended scope and acceptance are represented. |
| `HANDOFF.md` | Remove same-task chores and preserve only real continuation. | Review waiting, blocked, or next-work boundaries. |
| `evidence.jsonl` | Append through HADARA commands; never hand-rewrite history. | Usually inspect through its projection. |
| `EVIDENCE.md` | Refresh through supported tooling. | Read validation, residual failures, and close proof. |

## `TASK.md`: the complete bounded work contract

`TASK.md` is the authoritative description of one unit of work. It is not a progress summary and it is not replaced by a chat transcript, commit message, Task Board row, or `HANDOFF.md`. A new agent should be able to read it and determine the requested outcome, allowed change boundary, governing sources, implementation state, required proof, actual changes, and unresolved risk.

The agent writes the task-owned sections as decisions are made and work is performed. It does not wait until the end and reconstruct the contract from memory. The command-owned identity fields are the exception: HADARA creates and updates those fields through lifecycle commands.

### Identity

`Identity` binds every file in the capsule to the same task. `ID` and `Title` identify it, `Status` is its persistent lifecycle state, and `Created` plus `Updated` provide lifecycle timestamps. `task create` writes the initial `Draft` identity. The generated ownership note routes identity changes through HADARA commands; in particular, the agent must not make a task appear complete by manually changing `Status` to `Done`. Valid close updates the TASK and HANDOFF identities to `Done`, advances `Updated`, synchronizes the Task Board row, and records proof.

### Goal

`Goal` states the observable end condition, not an activity such as “investigate” or “work on retries.” Its `Notes` column records the product intent or compatibility expectation needed to interpret that outcome. If the desired outcome changes materially, the agent updates the goal while the task is open and records that change in `History`.

### Scope

`Scope` has explicit `In` and `Out` boundaries. `In` names the code, documents, behavior, and validation that belong to this capsule. `Out` prevents adjacent cleanup or a larger redesign from entering silently. Discovering useful work outside the boundary does not expand authority automatically; it becomes a risk, follow-up, or separate capsule.

### Plan

`Plan` is the live execution sequence. Each row names a concrete action and carries a status such as pending, in progress, or done. It should agree with the repository state: a step is not done merely because code was edited, and a validation step remains incomplete until its result has been recorded. The plan may evolve, but obsolete steps should be explained rather than hidden.

### Acceptance

`Acceptance` defines completion as observable criteria. Every row has a stable criterion ID, a precise statement, a state, an evidence reference, and a source or artifact reference. `Met` means the cited evidence actually demonstrates the criterion. `Pending`, failed, blocked, or residual conditions remain visible; prose confidence is not a substitute for evidence.

### Validation

`Validation` records the checks that were required and the checks that actually ran. `Gate` distinguishes checks required for close from informative checks. `Status` reports the observed result, `Detail` preserves enough context to understand it, and `Evidence` links the check to the canonical record. Acceptance asks “did the product satisfy the contract?” while Validation asks “what was executed or inspected to know that?” One does not replace the other.

### Inputs / Constraints

`Inputs / Constraints` names every source that governs implementation: specifications, architecture documents, user decisions, compatibility constraints, or required references. `Role`, `State`, and `Notes` explain how each source applies. This keeps an agent from treating every old document as current authority or overlooking a task-specific rule.

### Changes

`Changes` is the factual implementation ledger. It says which area changed and what was done there. It should describe the resulting behavior or document state, not merely list filenames or repeat the plan. If the implementation differs from the initial plan, this section records what actually landed.

### Risks / Follow-ups

`Risks / Follow-ups` preserves unresolved information instead of burying it in chat. Each entry receives an ID, type, concrete impact, state, and link. A mitigated risk remains useful history; an open blocker or follow-up must agree with Acceptance, Validation, evidence, and the continuation in `HANDOFF.md`.

### Close Summary

`Close Summary` is the source projected into the Task Board `Result` cell after valid close. It is intentionally compact because the Task Board is an index, but it never replaces the detailed Goal, Changes, Validation, Risks, or evidence. Before close, it must describe the completed result truthfully and must not claim work that the capsule does not prove.

### History

`History` records meaningful changes to task state, scope, plan, findings, and close preparation in chronological order. It is not a command log and should not contain every edit. Its purpose is to explain why the current contract differs from the original scaffold and which decisions a later agent must understand. Before close, the final row must record `Done`; close validates that row before it changes the command-owned Identity and Task Board status to `Done`.

### Complete `TASK.md` example

This example includes every generated section. It shows a task that has finished implementation and validation and is ready for close; no section is omitted.

```markdown
# T-0042 Fix retry backoff

## Identity

| Field | Value |
|---|---|
| ID | T-0042 |
| Title | Fix retry backoff |
| Status | Draft |
| Created | 2026-08-14T09:00Z |
| Updated | 2026-08-14T09:00Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`,
> `Created`, or `Updated`; use task lifecycle commands.

## Goal

| Goal | Notes |
|---|---|
| Add exponential retry backoff to transient requests. | Preserve the public request API and existing non-retry behavior. |

## Scope

| Boundary | Items |
|---|---|
| In | Retry delay calculation, transient-error path, focused tests, and task evidence. |
| Out | Request API redesign, unrelated timeout policy, and transport replacement. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Inspect retry policy and existing tests. | Done |
| 2 | Implement bounded exponential backoff. | Done |
| 3 | Run focused and regression validation. | Done |
| 4 | Reconcile evidence and prepare close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Transient retries use bounded exponential delays. | Met | ev:T-0042:7d91... | tests/retry.test.ts |
| AC-2 | The public request API remains compatible. | Met | ev:T-0042:a631... | tests/request-api.test.ts |
| AC-3 | Non-retryable failures remain immediate. | Met | ev:T-0042:7d91... | tests/retry.test.ts |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| npm test -- retry | Yes | Passed | 14 retry cases passed. | ev:T-0042:7d91... |
| npm test -- request-api | Yes | Passed | Public API regression suite passed. | ev:T-0042:a631... |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/RETRY_POLICY.md | specification | active | Defines retryable failures and maximum delay. |
| Existing request API | constraint | active | No caller migration is allowed in this capsule. |

## Changes

| Area | Summary |
|---|---|
| Retry policy | Added capped exponential delay calculation for transient failures. |
| Failure handling | Preserved immediate return for non-retryable failures. |
| Tests | Added delay, cap, compatibility, and non-retry regression coverage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Timing assertions use a deterministic clock rather than wall time. | Mitigated | tests/retry.test.ts |
| RF-2 | Follow-up | Add randomized jitter in a separate policy change. | Open | Future capsule |

## Close Summary

Added bounded exponential retry backoff while preserving the request API and
immediate non-retryable failures; focused and compatibility validation passed.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-14 | Draft | Initial task scaffold. |
| 2026-08-14 | Draft | Fixed the retry boundary and added focused tests. |
| 2026-08-14 | Done | Completed required validation and prepared close sources. |
```

## `HANDOFF.md`: the complete continuation contract

`HANDOFF.md` answers a different question: given the current phase of this exact capsule, what must the next agent know and what may it do next? It is not a shorter substitute for `TASK.md`. The next agent reads the task contract for scope and proof, then uses the handoff to locate the latest durable result, any prerequisite before close, the continuation after close, and warnings that still affect future work.

### Identity

The handoff repeats the command-owned identity so it cannot drift away from its capsule. While open, its status matches the task's persistent state. After valid close it becomes `Done`; the remaining sections must then describe post-close reality rather than instructing another agent to close the already terminal task.

### Last Completed

`Last Completed` records concrete durable milestones and the evidence that supports them. It is not a general progress paragraph. A next agent should be able to distinguish completed work from an intention, local experiment, or unrecorded claim. Important superseded or resolved findings may remain when their relationship is explained, but stale “pending” language must be removed when the work is complete.

### Pre-Close Operator Action

`Pre-Close Operator Action` contains only a prerequisite that must be satisfied before this same capsule can close. It may describe a human decision, missing input, dependency change, or other waiting condition. If no prerequisite remains, it must be `terminal/no` before proof-last close. Implementation, validation, evidence reconciliation, and capsule maintenance are ordinary same-task work; they should be completed rather than left as a fictional post-completion instruction.

### Post-Close Continuation

`Post-Close Continuation` describes the state that becomes current after successful close. It can be terminal, waiting, blocked, unresolved, or actionable. An actionable row names a concrete separate unit of work and uses `Create Task=yes`; it does not silently append that work to the capsule that just ended. If no work follows, the row is `terminal/no` and says so directly.

### Carry Forward Warnings

`Carry Forward Warnings` preserves risks, assumptions, compatibility facts, or unresolved context that remain relevant beyond the latest completed action. Every warning states its impact and a mitigation or handling rule. “None” is appropriate only when there is genuinely no residual information. A warning does not replace an open Acceptance criterion or failed evidence record.

### Open, ready-to-close, and closed meaning

| Capsule phase | Pre-Close Operator Action | Post-Close Continuation | Which row routes current work? |
|---|---|---|---|
| Open and waiting | The concrete prerequisite is `waiting-for-operator/no` or `blocked/no`. | The expected post-close state may already be prepared. | Pre-Close Operator Action. |
| Open and ready to close | `terminal/no`; no prerequisite remains. | Final terminal, waiting, blocked, or actionable continuation. | Close the current capsule after reviewing its proof plan. |
| Closed-valid | Historical only; it must not contain a current same-task chore. | The durable current continuation. | Post-Close Continuation. |

### Complete `HANDOFF.md` example

This is the matching ready-to-close handoff. Every generated section and every generated table column is present.

```markdown
# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0042 |
| Title | Fix retry backoff |
| Status | Draft |
| Created | 2026-08-14T09:00Z |
| Updated | 2026-08-14T09:00Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`,
> `Created`, or `Updated`; use task lifecycle commands.

## Last Completed

| Item | Evidence |
|---|---|
| Implemented bounded exponential retry delays and immediate non-retry failure handling. | ev:T-0042:7d91... |
| Passed the public request API compatibility suite. | ev:T-0042:a631... |
| Reconciled acceptance, validation, risks, and close-time continuation. | TASK.md; EVIDENCE.md |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| No prerequisite remains before close. | terminal | no | Implementation, required validation, evidence, and task-owned prose are complete. | TASK.md; EVIDENCE.md |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Evaluate randomized retry jitter as a separate policy change. | actionable | yes | Jitter is useful follow-up work but is outside this capsule's compatibility-preserving scope. | TASK.md; docs/RETRY_POLICY.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The retry policy does not add randomized jitter. | Large synchronized client groups may still retry together. | Evaluate jitter in the separate follow-up capsule before changing policy. |
```

After valid close, HADARA performs four visible updates: the TASK and HANDOFF identities become `Done` with a new `Updated` time; the Task Board row becomes `Done`; its `Result` receives the exact `Close Summary`; and readiness plus close-proof records are appended to evidence. It does not invent or rewrite the Goal, Scope, Plan, Acceptance, Validation, Inputs / Constraints, Changes, Risks / Follow-ups, Last Completed, continuation, or warning prose. Those task-owned sections must already be current before close. `Last Completed` remains a durable locator, and `Post-Close Continuation` becomes the current route; neither is allowed to erase or summarize away the underlying contract.

Examples of legitimate handoff states include waiting for human visual review, blocked on unavailable input or dependency, terminal with no next task, or actionable continuation that deserves a new capsule. “Run close for this already closed task” is stale handoff content, not a valid continuation. See [Evidence & Projections](#evidence) for how the cited records are stored and rendered.

## Evidence files at task creation

Fresh `task create` does not pretend that validation already happened. `evidence.jsonl` is zero-byte, while `EVIDENCE.md` contains the stable generated frame that later evidence commands populate:

| Generated section | Initial state | Later source |
|---|---|---|
| Validation Evidence | Empty four-column table: Evidence ID, Outcome, Category, Summary. | Non-close, non-residual canonical records. |
| Close Proof | Empty three-column table: Check, Result, Evidence. | Proof-last close evidence. |
| Failed / Blocked / Residual Evidence | Empty five-column table: Evidence ID, Outcome, Summary, Disposition, Reference. | Failed or blocked records plus their durable resolution relationship. |

The Markdown frame is present from task creation so humans always know where to inspect. It is not evidence by itself; only records appended to `evidence.jsonl` and projected through the supported command path populate those rows.

## Persistent task state versus derived close state

| Family | Examples | Meaning |
|---|---|---|
| TaskStatus | `Draft`, `In Progress`, `Blocked`, `Done`, `Partial`, `Superseded`, `Archived` | Persistent lifecycle state. |
| CloseState | `not-closed`, `closed-valid`, `closed-stale`, `closed-invalid`, `unknown` | Derived proof state. |
| EvidenceOutcome | `passed`, `failed`, `blocked`, `unknown`, `recorded`, `not-applicable` | Outcome of an evidence record. |

`closed-valid` is not a TaskStatus value. The distinction matters because a task can remain persistently `Done` while its prior close proof becomes stale after legitimate close-source changes.

## Handoff phases at close

Close-time handoff separates work that must happen before proof-last close from guidance that remains true after the task is Done.

```text
Pre-Close Operator Action
  └─ same-capsule prerequisites only

Post-Close Continuation
  └─ terminal / waiting / blocked / actionable next state
```

Structured continuation semantics let the next agent distinguish `actionable`, `waiting-for-operator`, `blocked`, `terminal`, and `unresolved` state without guessing from prose.

`Disposition` and `Create Task` are one controlled relationship, not two unrelated labels:

| Disposition | Create Task | Meaning |
|---|---|---|
| `actionable` | `yes` | The continuation is a concrete separate future unit of work and should create a new capsule. |
| `waiting-for-operator` | `no` | Resume only after a human decision, dependency change, or an already-created capsule becomes available. Use this for continuation to an existing capsule rather than `actionable/no`. |
| `blocked` | `no` | A concrete blocker prevents progress; do not manufacture another capsule merely to restate it. |
| `unresolved` | `no` | The next state is not yet classified well enough to authorize new work. |
| `terminal` | `no` | No follow-up capsule should be created. |

`Create Task=yes` is valid only with `actionable`; every other disposition uses `no`. Before a Done close, `Pre-Close Operator Action` must already be `terminal/no`, because same-capsule prerequisites belong before proof-last close. `Post-Close Continuation` then carries the state that remains current after close.

## Currentness matters

After close proof is recorded, editing close-source documents intentionally invalidates that proof. The agent should repair the correct layer and rerun close rather than asking the human to manually rewrite status fields or evidence records.
