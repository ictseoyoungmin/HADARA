# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and deferred evidence migration boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended task. | Read |
| docs/TASK_BOARD.md | Task queue and T-0236 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation baseline. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice completion state and next row placement. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit loop semantics. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON/write-boundary documentation surface. | Read |
| docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md | Evidence v2 migration requirements. | Read |
| src/services/evidence-migration.ts | T-0235 preview implementation to extend. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0235 preview report is the right base for execute mode. | AGENT_HANDOFF and T-0235 implementation. | Execute could drift from preview if implemented separately. |
| `--before-hash` should be supplied by the operator from a fresh preview. | Migration plan. | Without it execute can race concurrent evidence writes. |
| `EVIDENCE.md` id display remains deferred. | AGENT_HANDOFF and T-0236 scope. | Bundling Markdown rewrite would enlarge blast radius. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| One Task Capsule per implementation slice. | IMPLEMENTATION_SOP. | T-0236 owns this work. |
| Docker validation is the repository baseline. | IMPLEMENTATION_SOP and AGENT_HANDOFF. | Host-local npm state is not authoritative. |
| Execute writes must be bounded. | TASK_WORKFLOW_COMMANDS and migration plan. | Only selected `evidence.jsonl` may be rewritten. |
| No secrets/private logs in committed evidence. | AGENTS/SOP evidence rules. | Migration preserves existing public/private visibility and redacts summaries through existing preview logic. |
