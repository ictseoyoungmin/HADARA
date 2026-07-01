# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `hadara evidence add-command --help` now prints help before mutation guards or required `--task` parsing. | `ev:T-0456:3575c0472d5b464585261a79` |
| Built CLI smoke confirmed `evidence add-command --task T-0456 --help` left `evidence.jsonl` line count and `EVIDENCE.md` hash unchanged. | `ev:T-0456:2c697ca98ea7410a9a9f23d9` |
| Evidence CLI test fixtures now initialize 0.4 protocol metadata before mutation tests, matching the legacy-boundary guard. | `ev:T-0456:3575c0472d5b464585261a79` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open the next agent UX capsule for `validation run` wrapper error semantics. | T-0454/T-0455 dogfood showed nested `spawnSync node EPERM` / `spawnSync bash EPERM` when wrapping HADARA CLI checks even though direct commands passed; T-0456 fixed the separate help mutation hazard. | `src/services/validation-run.ts`, `src/cli/validation.ts`, `tests/unit/validation-run.test.ts`, `tasks/T-0454-agent-ux-validation-attempt-auto-resolution/HANDOFF.md`, `.hadara/context/MEMORY.md` |
| Later, consider a shared help-before-mutation invariant across command handlers. | T-0456 fixed the evidence command locally; a broader command-family guard would reduce repeated handler-specific safety logic. | `src/cli/main.ts`, `src/cli/help.ts`, `src/services/capability-registry.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `evidence add-command --help --json` still emits text help, not a JSON help envelope. | This preserves current help behavior but is not ideal for machine consumers. | Treat JSON help as a separate command-help contract capsule if needed. |
| T-0456 recorded evidence with direct `evidence add-command` instead of `validation run`. | This avoids the still-open nested spawn wrapper issue, but `task status` validation-attempt projection will not classify these as validation-run attempts. | Use evidence ids in the capsule Validation table until wrapper error semantics are fixed. |
