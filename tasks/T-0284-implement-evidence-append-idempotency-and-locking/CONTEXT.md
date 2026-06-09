# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `docs/PROJECT_STATE.md` | Current project state. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and rc3 next priority. | Read |
| `docs/TASK_BOARD.md` | Task queue and status. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules and Docker validation preference. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Evidence/finish/ready/close workflow semantics. | Read |
| `docs/CLI_JSON_CONTRACT.md` | JSON command contract guidance. | Read |
| `docs/specs/rc3-proof-reliability/01_Evidence_Append_Idempotency_and_Locking.md` | Source design for this capsule. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The rc3 P0 bug is local parallel evidence append duplication, not a distributed multi-host write protocol. | rc3 reliability spec | Overbuilding a distributed lock would exceed the capsule scope. |
| Keyless manual evidence must remain append-only. | rc3 reliability spec and existing evidence UX | Deduplicating without an explicit key would hide legitimate repeated evidence attempts. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit `evidence.jsonl`. | AGENTS.md / SOP | Evidence records are appended through the rebuilt CLI only. |
| Keep the lock under ignored local HADARA state. | rc3 reliability spec | `.hadara/local/locks/evidence/<task>.lock/` is intentionally not committed. |
| Refresh built `dist` after CLI behavior changes. | SOP | Workspace `dist` was copied from the successful `/tmp` validation build. |
