# HADARA_CONTEXT

## Purpose

Compact project-local context anchor and read router.

This file is not the Required Reading authority, workflow manual, project history, task history, or evidence log. `AGENTS.md` owns Required Reading. `docs/HADARA_WORKFLOW.md` owns command and lifecycle guidance.

## Project

| Field | Value |
|---|---|
| HADARA Protocol | 0.4 |
| Profile | CLI-filled |
| Workflow Reference | `docs/HADARA_WORKFLOW.md` |
| Current State | `docs/PROJECT_STATE.md` |
| Task Board | `docs/TASK_BOARD.md` |
| Handoff | `docs/AGENT_HANDOFF.md` when present |

## Read Routing

| Need | Read |
|---|---|
| Required reading and safety rules | `AGENTS.md` |
| Current project state | `docs/PROJECT_STATE.md` |
| Current or next task | `docs/TASK_BOARD.md` |
| HADARA command workflow | `docs/HADARA_WORKFLOW.md` |
| Task-specific scope and acceptance | Active `tasks/T-*/TASK.md` |
| Task continuation notes | Active `tasks/T-*/HANDOFF.md` |

## Rule

Prefer `hadara session start --json`, `hadara task status --task T-XXXX --json`, and `hadara context pack --task T-XXXX --json` before broad manual reading.
