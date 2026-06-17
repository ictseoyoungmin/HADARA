# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `tasks/T-0330-phase-9-evidence-v2-writer-stabilization/` | Update | Active Task Capsule docs for this slice. | Done |
| `src/evidence/evidence.ts` | Update | Add explicit v2 category/outcome/tag input support while preserving idempotency semantics. | Done |
| `src/cli/evidence.ts` | Update | Parse new `add-command` options. | Done |
| `src/cli/evidence-json.ts` | Update | Carry new metadata through JSON evidence append reports. | Done |
| `src/evidence/semantics.ts` | Update | Prefer exact resolution markers and keep same-category fallback legacy-only. | Done |
| `tests/unit/evidence-json.test.ts` | Update | Cover writer/CLI metadata behavior. | Done |
| `tests/unit/evidence-semantics.test.ts` | Update | Cover resolution precedence. | Done |
| `tests/unit/evidence-lint.test.ts` | Update | Cover v2 exact-resolution lint behavior. | Done |
| `tests/unit/init.test.ts` | Update | Keep generated workflow docs aligned. | Done |
| `tests/unit/task-workflow-docs.test.ts` | Update | Keep workflow docs regression coverage aligned. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Update | Document additive command options. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Update | Document evidence add-command semantics. | Done |
| `docs/IMPLEMENTATION_SOP.md` | Update | Keep workflow guidance current. | Done |
| `README.md` | Update | Keep package-facing command guidance current. | Done |
| `src/services/capability-registry.ts` | Update | Keep command registry current. | Done |
| `src/cli/init.ts` | Update | Keep generated init workflow text current. | Done |
