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

## Persistent task state versus derived close state

| Family | Examples | Meaning |
|---|---|---|
| TaskStatus | `Draft`, `In Progress`, `Blocked`, `Done`, `Partial`, `Superseded`, `Archived` | Persistent lifecycle state. |
| CloseState | `not-closed`, `closed-valid`, `closed-stale`, `closed-invalid`, `unknown` | Derived proof state. |
| EvidenceOutcome | `passed`, `failed`, `blocked`, `unknown`, `recorded`, `not-applicable` | Outcome of an evidence record. |

`closed-valid` is not a TaskStatus value. The distinction matters because a task can remain persistently `Done` while its prior close proof becomes stale after legitimate close-source changes.

## Handoff phases

Close-time handoff separates work that must happen before proof-last close from guidance that remains true after the task is Done.

```text
Pre-Close Operator Action
  └─ same-capsule prerequisites only

Post-Close Continuation
  └─ terminal / waiting / blocked / actionable next state
```

Structured continuation semantics let the next agent distinguish `actionable`, `waiting-for-operator`, `blocked`, `terminal`, and `unresolved` state without guessing from prose.

## Currentness matters

After close proof is recorded, editing close-source documents intentionally invalidates that proof. The agent should repair the correct layer and rerun close rather than asking the human to manually rewrite status fields or evidence records.
