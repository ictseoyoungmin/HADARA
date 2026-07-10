# 04 Task Capsule Schema

## Goal

Define the HADARA 0.4 Task Capsule as the only task schema for new 0.4 projects.

Do not describe this as compact vs expanded in user-facing docs. In HADARA 0.4, this is simply the Task Capsule.

## Task Create

```bash
hadara task create "Add dashboard action busy guard" --json
```

No layout flag exists.

## Generated Files

```text
tasks/T-0001-add-dashboard-action-busy-guard/
  TASK.md
  HANDOFF.md
  evidence.jsonl
  EVIDENCE.md
```

## Ownership

| File | Role | Human direct edit | Agent edit | CLI edit | Close-source |
|---|---|---:|---:|---:|---:|
| `TASK.md` | Canonical task contract | Prefer indirect instruction | Yes | Managed slots / lifecycle | Yes |
| `HANDOFF.md` | Task continuation guidance | Prefer indirect instruction | Yes | Suggested slots | No by default |
| `evidence.jsonl` | Canonical append-only evidence | No | No direct edit | Append-only | No raw hash |
| `EVIDENCE.md` | Human evidence projection | No | No direct edit | Projection | No |

Detailed authoring ownership is documented once in `docs/HADARA_WORKFLOW.md` and in the managed slot/table registries. Do not add long ownership comments or repeated instruction tables to every generated Task Capsule.

## `TASK.md` Sections

```text
Identity
Source Documents
Goal
Plan
Acceptance
Validation
Change Summary
Risks / Follow-ups
```

`TASK.md` must not include:

```text
separate bottom Status section
Close Proof section
audit-close result table
raw evidence log
post-close mutation record
```

## `HANDOFF.md` Sections

```text
Last Completed
Next Recommended Step
Carry Forward Warnings
```

`Next Recommended Step` is for the next capsule-level or project/global-state recommendation. It must not be used for same-capsule lifecycle chores such as "run tests", "update acceptance", or "finalize this task".

`HANDOFF.md` must not include:

```text
canonical TaskStatus
CloseState
close proof
duplicated task identity fields
```

`HANDOFF.md` is continuation guidance. It may be updated after close without invalidating close proof, as long as the task contract in `TASK.md` is not changed. If a regulated project wants task-local handoff to become close-source, it must opt into that behavior through a future explicit close-source profile; it is not the 0.4 default.

## `EVIDENCE.md` Sections

```text
Validation Evidence
Close Proof
Failed / Blocked / Residual Evidence
```

`EVIDENCE.md` is a projection. It may change after close without invalidating close-source docs.

## `evidence.jsonl`

The file starts empty. It must be append-only and written only through HADARA evidence commands.

## Scaffold Size Targets

| File | Target |
|---|---:|
| Fresh `TASK.md` | <= 130 lines |
| Fresh `HANDOFF.md` | <= 50 lines |
| Fresh `EVIDENCE.md` | <= 60 lines |
| Fresh capsule total | <= 250 lines |

These are product UX targets, not strict release blockers at first. `init doctor` and `harness validate` may report warnings when exceeded.
