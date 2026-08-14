---
id: limits-and-recovery
group: Reference
label: Limits & Recovery
short: What HADARA does not automate and how to respond when a guarded path stops.
icon: shield-check
eyebrow: Operating boundary
title: Know where HADARA stops—and how to recover.
lead: HADARA is deliberately conservative around ambiguous project state, concurrent writers, and interrupted lifecycle writes. A stopped plan should leave a specific report to inspect, not invite a forceful blind retry.
callout: Fail-closed behavior protects existing project state. Preserve the report, repair the stated boundary, and generate a fresh plan instead of bypassing identity or currentness checks.
audience: shared
order: 31
---

## 01 · Inspect
### Read the reported boundary
The command report should identify whether setup stopped on an existing file, partial setup state, stale plan hash, symlink, nested root, validation failure, or another concrete boundary.

## 02 · Coordinate
### Treat shared files as shared writes
Evidence appends have task-scoped locking, but HADARA does not merge simultaneous source edits or turn one working tree into a distributed multi-agent scheduler.

## 03 · Recover
### Repair, then re-plan
Keep the observed failure, fix the concrete cause, and request current status or a fresh dry-run. Do not reuse an old plan hash after its source files change.

## When init does not apply

| Symptom | Meaning | Safe response |
|---|---|---|
| Init prints a plan but writes nothing. | JSON, CI, piped, redirected, and agent execution are intentionally non-interactive. | Review the report and execute the exact current plan-hash command only when the write is authorized. |
| Existing project requires adoption. | HADARA detected project-owned state that must not be overwritten as a greenfield scaffold. | Review the `--adopt` plan, especially managed insertions and conflicts, before execute. |
| Adoption reports a conflict or unsafe path. | An existing file, managed marker, symlink, ancestor HADARA root, or other boundary is ambiguous. | Preserve the file and report; resolve the named conflict or choose a different root, then generate a fresh plan. |
| Only one of `.hadara/project.json` or `.hadara/documents.json` is valid. | Project setup is partial or malformed, so init cannot choose a safe write. | Do not invent or hand-patch the missing file. Recover from known project history or follow the reported repair guidance. |
| Execute rejects the plan hash. | The project changed after planning, so the reviewed write is stale. | Run init again, review the new diff, and use only the new hash. |
| Base init is a no-op. | The project is already initialized; base init is idempotent. | Use current status for normal work. If managed state is damaged, ask the agent to inspect status and doctor output instead of editing managed JSON by hand. |

## When task close stops

| Symptom | Meaning | Safe response |
|---|---|---|
| Close rejects contradictory handoff continuation before writing. | The current pre-close row or the post-close row that would become active disagrees about whether another task should be created. | Correct the HANDOFF row, rerun dry-run, and use the fresh reviewed plan. |
| Close reports an interrupted transaction or recovery action. | A prior close did not finish cleanly or its expected writes no longer match current source. | Preserve the report, avoid hand-editing lifecycle-owned fields, and follow the returned recovery action. If source changed, generate a fresh plan. |

## Several agents in one repository

Multiple agents can participate when each begins with current status and respects normal repository coordination. That does not make arbitrary parallel writes safe.

- Prefer separate capsules and non-overlapping source areas for independent work.
- Treat `TASK.md`, `HANDOFF.md`, shared docs, Task Board projection, and close as serialized lifecycle writes.
- Evidence append commands use task-scoped locks, but those locks do not merge application source, prose, Git history, or two conflicting close attempts.
- After another agent changes the capsule or shared project state, refresh status and regenerate any dry-run plan before continuing.
- Across different machines or independent clones, use ordinary source-control coordination. HADARA does not currently provide a hosted global scheduler or cross-machine lock service.

## Current product limits

| Limit | Practical consequence |
|---|---|
| No model hosting or agent selection | You bring a coding-agent runtime. It must discover `AGENTS.md` or be configured to read it, and it must be able to run local commands. |
| No guarantee that an agent obeys instructions | Repository policy and HADARA guards improve observability; model behavior still requires review, bounded permissions, and real validation. |
| Local-first project authority | HADARA stores protocol state in the repository. It does not currently provide a hosted dashboard, shared database, or automatic cross-machine synchronization. |
| Conservative brownfield adoption | Init does not infer every existing document's purpose or overwrite ambiguous project-owned content. Some projects require manual conflict resolution before adoption. |
| Presets are scaffold choices | `governed` adds architecture, security, and governance documents; it does not enforce those documents or certify compliance. |
| Project tests define engineering confidence | HADARA records and evaluates supplied checks, but it cannot create an independent correctness oracle for every codebase. |
| Nested roots are not a default init workflow | Choose one clear project root instead of assuming nested HADARA projects will coordinate automatically. |

## What to give the agent when asking for help

Include the command, exit code, structured issue code or summary, affected path, whether the project is new or existing, and whether another agent or process changed the workspace after the plan was produced. Do not paste secrets or private raw logs into Task Capsules.

The agent should explain the current state, preserve failed evidence when it belongs to an active capsule, and propose the smallest recoverable next action.
