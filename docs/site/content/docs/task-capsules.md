---
id: task-capsules
group: Core model
label: Task Capsules
short: The smallest durable unit of work.
icon: boxes
eyebrow: Durable work unit
title: Give every agent the same work surface.
lead: A Task Capsule packages what must remain stable while models, sessions, prompts, and tools change around it.
callout: TASK.md carries the contract. Runtime state and derived close state belong to their canonical machine-readable surfaces.
order: 11
---

## Contract
### Goal & acceptance
Every capsule starts with a bounded goal and acceptance criteria that can be checked later.

## Context
### Sources & constraints
A capsule records the files, specs, decisions, and risks that constrain the work, so the next session does not need to rediscover them.

## Continuity
### Resume & handoff
A capsule carries close-time handoff for the next meaningful project step, not same-capsule cleanup.

## Commands
```shell
hadara task status --task T-0042 --json
hadara context pack --task T-0042 --json
hadara task close --task T-0042 --json
```

## Anatomy of a capsule

A Task Capsule is a directory under `tasks/`:

```text
tasks/T-0042-fix-retry-backoff/
├── TASK.md         task contract and close-source prose
├── HANDOFF.md      close-time continuation guidance
├── EVIDENCE.md     generated human evidence summary
└── evidence.jsonl  canonical append-only evidence records
```

`evidence.jsonl` is canonical. `EVIDENCE.md` is a generated projection and must not be treated as the source of truth.

## TASK.md sections

| Section | Purpose |
|---|---|
| Identity | ID, title, lifecycle status, created/updated timestamps |
| Goal | The outcome and any scoping notes |
| Scope | Explicit in/out boundary |
| Plan | Work steps and their current state |
| Acceptance | Criteria, requiredness, status, evidence refs, disposition |
| Validation | Checks that produce evidence, including whether they gate close |
| Inputs / Constraints | Sources this task depends on |
| Changes | What changed during the task |
| Risks / Follow-ups | Residuals that outlive this capsule |
| History | Status and lifecycle notes over time |

## Status ownership

Do not collapse all statuses into one meaning. HADARA uses different token families for persistent lifecycle state, evidence outcomes, document state, and derived close state.

Persistent TaskStatus includes:

| Token | Meaning | Writer |
|---|---|---|
| `Draft` | Capsule exists but is not yet ready for done-level validation. | `task create`, worker docs |
| `In Progress` | Work is actively being performed. | Worker docs |
| `Blocked` | Work cannot proceed without a recorded blocker. | Worker/coordinator docs |
| `Done` | Scoped work has closed through `task close`. | `task close --json` |
| `Partial` | Deliberate partial completion with residual scope recorded. | Worker/coordinator docs |
| `Superseded` | Replaced by another capsule. | Worker/coordinator docs |
| `Archived` | Retained for history, not active. | Worker/coordinator docs |

The command-owned cells of `docs/TASK_BOARD.md` are updated by lifecycle commands. Do not manually set `TASK.md` Identity `Status` or Task Board Status to force closure.

## Acceptance rows

Acceptance should be written so another agent can tell what evidence is required.

| Column | Meaning |
|---|---|
| `ID` | Stable criterion id such as `AC-1` |
| `Criterion` | Observable condition |
| `Required` | `Yes` or `No` |
| `Status` | `Pending`, `Met`, `Not Met`, `Blocked`, or `Not Applicable` |
| `Evidence` | Durable evidence refs such as `ev:T-0042:...` |
| `Disposition` | `Required`, `Optional`, `Deferred`, `Accepted Risk`, `Not Applicable`, or `Superseded` |
| `Reference` | Required when deferring, accepting risk, or superseding |

`task close` uses these rows as close-source input. It will not convert vague prose into proof.

## Handoff rules

Before close, reread `HANDOFF.md` and make it current.

Good handoff:

- points to the next capsule or global follow-up
- names required reading for that next step
- marks completed follow-up as completed/superseded
- avoids stale “next work” from earlier in the task

Bad handoff:

- “run tests”
- “update acceptance”
- “close this task”
- “TBD”
- “do the same task cleanup again”

Same-capsule chores should be completed before `task close`, not delegated through handoff.

## Capsule locality

A Task Capsule should be useful even after the chat session disappears. The capsule does not need to contain every project file, but it must contain enough contract, evidence, and handoff state for a new agent to resume safely through HADARA read models.
