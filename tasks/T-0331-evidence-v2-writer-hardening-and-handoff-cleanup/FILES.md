# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/cli/evidence.ts` | Update | Reject incompatible explicit `--result`/`--outcome` pairs before append. | Done |
| `src/evidence/semantics.ts` | Update | Count exact resolution markers only from later passed or recorded evidence. | Done |
| `src/evidence/evidence.ts` | Update | Ignore `TASK.md`-less task-like directories and reject ambiguous same-id capsules. | Done |
| `src/cli/evidence-json.ts` | Update | Surface evidence task directory errors as JSON issues. | Done |
| `tests/unit/evidence-json.test.ts` | Update | Cover mismatch guard, recorded compatibility, and ambiguous task JSON issue. | Done |
| `tests/unit/evidence-semantics.test.ts` | Update | Cover marker outcome guard. | Done |
| `tests/unit/evidence-lint.test.ts` | Update | Cover failed marker not resolving earlier failed evidence. | Done |
| `tests/harness/task-capsule.test.ts` | Update | Cover writer behavior with task-like leftovers and ambiguous capsules. | Done |
| `tests/unit/package-smoke-dry-run.test.ts` | Update | Make smoke evidence fixture a real `TASK.md`-bearing capsule. | Done |
| `tests/unit/clean-checkout-smoke.test.ts` | Update | Make smoke evidence fixture a real `TASK.md`-bearing capsule. | Done |
| `README.md` | Update | Document result/outcome compatibility rule. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Update | Document mismatch failure code and add-command contract. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Update | Document outcome tokens, mismatch rule, and marker resolution rule. | Done |
| `docs/IMPLEMENTATION_SOP.md` | Update | Keep workflow evidence guidance current. | Done |
| `src/cli/init.ts` | Update | Keep generated workflow guidance current. | Done |
| `src/services/capability-registry.ts` | Update | Keep command registry summary current. | Done |
| `tasks/T-0330-phase-9-evidence-v2-writer-stabilization/HANDOFF.md` | Update | Remove stale finish/ready/close/audit next-step guidance. | Done |
| `tasks/T-0331-evidence-v2-writer-hardening-and-handoff-cleanup/` | Update | Active Task Capsule docs and evidence. | Done |
