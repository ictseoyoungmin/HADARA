# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/evidence/evidence.ts | Update | Preserve optional v2 tags, idempotencyKey, and actor metadata for close proofs. | Done |
| src/task/task-close.ts | Update | Add close evidence idempotency planning, duplicate no-op execute behavior, supersedes tags, and audit metadata. | Done |
| src/schemas/task-close.schema.json | Update | Document additive `closeEvidenceWrite` metadata. | Done |
| src/schemas/task-audit-close.schema.json | Update | Document additive `closeEvidenceAudit` metadata. | Done |
| tests/unit/task-close.test.ts | Update | Cover same-hash no-op, changed-hash supersedes, and audit metadata. | Done |
| tests/unit/evidence-json.test.ts | Update | Cover optional v2 idempotency/tags/actor metadata preservation. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Update | Document close idempotency/supersedes policy. | Done |
| docs/CLI_JSON_CONTRACT.md | Update | Document close/audit additive metadata. | Done |
| docs/SCHEMAS.md | Update | Document schema fixture metadata additions. | Done |
| docs/DEVELOPMENT_SLICES.md | Update | Mark T-0256 slice complete with validation evidence. | Done |
| docs/PROJECT_STATE.md | Update | Advance project state through T-0256. | Done |
| docs/AGENT_HANDOFF.md | Update | Advance next task to T-0257 and record validation baseline. | Done |
| docs/TASK_BOARD.md | Update | Register and finish T-0256 capsule. | Done |
| tasks/T-0256-close-evidence-idempotency-supersedes/* | Update | Record capsule scope, acceptance, tests, decisions, risks, evidence, and handoff. | Done |
