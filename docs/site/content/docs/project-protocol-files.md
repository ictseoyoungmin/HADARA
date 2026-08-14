---
id: project-protocol-files
group: Core model
label: Project Protocol Files
short: How AGENTS, workflow, read maps, task contracts, and handoffs guide the agent.
icon: folder-tree
eyebrow: Project-local protocol
title: The repository tells each agent how to resume safely.
lead: HADARA does not rely on a chat session remembering the project. Repository instructions establish the rules, current-state routing selects the work, and the active Task Capsule preserves the bounded contract and continuation.
callout: The human states intent. The coding agent reads these files and uses the CLI. Each surface has a different scope; no single Markdown file is expected to contain the whole project state.
audience: shared
order: 4
---

## 01 · Instruct
### `AGENTS.md` sets repository rules
It is the agent's project-local entry contract: required reading, safety boundaries, workflow expectations, and project-specific operating rules.

## 02 · Route
### Status and registered routing narrow the reading
`hadara task status --json` selects current work. The agent then uses the selected capsule and `hadara docs read-map --task T-XXXX --json` when deeper routing is needed. `TASK_BOARD.md` and `READ_MAP.md` remain inspectable fallback projections rather than mandatory files to open every session.

## 03 · Continue
### `TASK.md` and `HANDOFF.md` preserve the work
The task file owns the bounded implementation contract; the handoff records what was completed and what remains true at the current lifecycle phase.

## Why these files exist

Agent sessions are disposable. Project state is not. HADARA keeps durable instructions and task state in the repository so a new coding agent can answer four questions without reconstructing the project from old conversation:

1. **What rules apply here?** Read `AGENTS.md`.
2. **What work is current?** Ask `hadara task status --json`.
3. **Where is that capsule recorded?** Use the status projection; inspect `docs/TASK_BOARD.md` directly only for fallback or queue audit.
4. **Which deeper documents matter now?** Ask `hadara docs read-map --task T-XXXX --json`, then follow the selected capsule's exact sources.
5. **What was promised, proved, and left for the next session?** Read `TASK.md`, `HANDOFF.md`, and the evidence projection.

## Session ingress and continuation

```text
human request
    ↓
AGENTS.md                         repository rules and required reading
    ↓
hadara task status --json        current task / waiting / create recommendation
    ↓
selected TASK.md + HANDOFF.md    bounded contract and continuation
    ↓
hadara docs read-map --task ...  deeper sources only when needed
    ↓
agent implements → validates → records evidence → closes or hands off
```

`task status` is the primary current-state ingress. `docs read-map` reads registered document state and returns task-specific routing. Direct reads of generated `READ_MAP.md` or command-managed `TASK_BOARD.md` are fallback/audit paths; neither file becomes mandatory context merely because it exists.

## What each file is responsible for

| Surface | Scope and authority | When the agent reads it | What a human reviews |
|---|---|---|---|
| `AGENTS.md` | Repository-level instructions for agents: required reading, safety, ownership, and workflow rules. | At every session start. | Policy changes and project-specific constraints. |
| `docs/HADARA_WORKFLOW.md` | The project's detailed operating workflow: normal CLI route, environment fallback, validation, evidence, and close behavior. | Every implementation session, or when the project instructs it as required reading. | Whether the workflow matches how the project should be developed. |
| `docs/TASK_BOARD.md` | Project-level index of Task Capsules with persistent status, capsule path, and compact summary. Lifecycle commands project matching board state. | Through `task status`, and directly when auditing the task queue or locating another capsule. | Which tasks exist, where they live, and whether the queue reflects intended priorities. |
| `.hadara/context/READ_MAP.md` | Generated compact projection of registered document routing. | Directly only when CLI routing is unavailable or routing drift is under investigation; agents normally use `docs read-map`. | Whether important documents are classified and routed appropriately. |
| `tasks/T-*/TASK.md` | The selected task's bounded contract: goal, scope, plan, acceptance, validation, constraints, changes, risks, and history. | Before and during work on that capsule. | Whether the agent is solving the requested problem with acceptable proof. |
| `tasks/T-*/HANDOFF.md` | Compact phase-aware continuation: last completed work, pre-close action, post-close continuation, and carry-forward warnings. | At resume, before stopping, and before close. | Waiting, blocker, and next-work boundaries. |
| `tasks/T-*/EVIDENCE.md` | Human-readable projection of append-only canonical evidence. | When explaining validation and close state. | What passed, what failed, what remains unresolved, and whether close proof exists. |

## `AGENTS.md` is the instruction entry point

`AGENTS.md` tells a coding agent how this repository expects work to be performed. In a HADARA project it normally names the required current-state documents, says to use Task Capsules, defines safe command boundaries, and explains which files are agent-owned, generated, or human-reviewed.

It is not a substitute for the active task. Repository policy belongs in `AGENTS.md`; the goal and acceptance for one bounded change belong in that task's `TASK.md`.

## `HADARA_WORKFLOW.md` explains the operating loop

The workflow document expands the repository rules into a repeatable procedure: inspect current state, select or create a capsule, keep its contract current, run real validation, append evidence, and perform proof-last close. It can also document project-specific execution environments such as a reusable development container.

The agent follows this document. A normal product user does not need to replay it as a terminal checklist.

## `TASK_BOARD.md` is the project task index

The Task Board answers a different question from `TASK.md`. The board tells the project **which capsules exist, their persistent status, and where each capsule lives**. The selected capsule's `TASK.md` then supplies the complete contract for one unit of work.

The board is not a second detailed task database. It keeps a compact row per capsule and lets status/close workflows project lifecycle bookkeeping consistently. Humans can use it to inspect queue shape and task paths; agents normally enter through `task status` so current routing and health are interpreted rather than guessed from a row alone.

The Task Board uses `ID`, `Title`, `Status`, `Targets`, `Capsule`, and `Result`. Those compact cells have specific lineage:

| Cell | Where it comes from | What happens later |
|---|---|---|
| `Targets` | Target references supplied when the capsule is created, such as `project` or `component:docs`. | Lifecycle commands preserve the target instead of inferring it again from later prose. |
| `Capsule` | The task directory created for that task ID. | It remains the durable route from the project index to the selected Task Capsule. |
| `Result` | Starts as `-`; it is not an independently authored board summary. | During close, HADARA reads the current `TASK.md` `Close Summary`, normalizes it into a compact plain-text cell, and projects that result into the board. |

This means the board can show where a task was aimed and what it concluded without becoming a second authority for either fact. Correct the task creation target or the capsule's `Close Summary`; do not independently rewrite board lineage.

## `READ_MAP.md` is the compact fallback map

The generated `.hadara/context/READ_MAP.md` is intentionally small. Each row contains only `Document`, `Read Policy`, and `Status`. It does **not** contain the richer `readTier`, authority, edit policy, selected-task injection, or `readFirst` / `readIfNeeded` / `doNotReadByDefault` grouping.

That richer, task-aware view comes from `hadara docs read-map --task T-XXXX --json`. The command reads registered document state, combines it with the selected capsule, and returns detailed routing groups and metadata. The Markdown file remains an inspectable fallback when CLI routing is unavailable or when someone is auditing projection drift.

Because it is generated state, edits should go through the document registry or supported HADARA ownership path rather than treating the projection as an independent source of truth.

## How the files work together

> `AGENTS.md` answers **how this repository must be handled**. `HADARA_WORKFLOW.md` answers **how the development loop operates**. `TASK_BOARD.md` projects **which capsules exist and where they live**. The registry-backed read-map route answers **what should be read now**. `TASK.md` answers **what this bounded change promises**. `HANDOFF.md` answers **where the work continues from here**.

That separation is deliberate. It keeps stable repository policy out of transient handoff notes and keeps one task's implementation details out of the global agent contract.
