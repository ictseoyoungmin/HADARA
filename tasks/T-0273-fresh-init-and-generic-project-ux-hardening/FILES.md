# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/cli/init.ts` | Modified | Add `hadara.init.v1` JSON output and narrow old-profile detection. | Done |
| `src/services/operations-status-service.ts` | Modified | Parse table-first `## Current Phase` rows. | Done |
| `src/tui/read-model.ts` | Modified | Keep TUI phase extraction aligned with status read model. | Done |
| `src/handoff/handoff.ts` | Modified | Return structured handoff update report. | Done |
| `src/cli/handoff.ts` | Modified | Print `hadara.handoff.update.v1` in JSON mode. | Done |
| `src/handoff/handoff-suggestion.ts` | Modified | Use generic project continuation wording. | Done |
| `src/cli/doctor.ts` | Modified | Report concrete context export file path. | Done |
| `src/cli/main.ts` | Modified | Update help for `init --json` and `handoff update --json`. | Done |
| `tests/unit/*.test.ts` | Modified | Add focused regressions for T-0271 findings. | Done |
| `README.md`, `docs/CLI_JSON_CONTRACT.md` | Modified | Document JSON surfaces. | Done |
| `tasks/T-0273-fresh-init-and-generic-project-ux-hardening/` | Added/updated | Capsule docs and evidence. | In Progress |
