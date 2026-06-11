# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Phase 7.2 AC-7.2-1: `docs/LIFECYCLE_GUIDE.md` exists and matches registry vocabulary. | Done | `docs/LIFECYCLE_GUIDE.md`; `tests/unit/lifecycle-guide.test.ts` |
| AC-2 | Phase 7.2 AC-7.2-2 and AC-7.2-8: `docs/COMMAND_PORTFOLIO_AUDIT.md` documents non-overlap, canonical, alias, diagnostic, advanced, dev-only, and release-only decisions. | Done | `docs/COMMAND_PORTFOLIO_AUDIT.md`; `tests/unit/command-portfolio-audit.test.ts` |
| AC-3 | Phase 7.2 AC-7.2-3: `hadara help lifecycle --json` returns `hadara.lifecycle.guide.v1`. | Done | `src/services/lifecycle-guide.ts`; built CLI smoke |
| AC-4 | Phase 7.2 AC-7.2-4 and AC-7.2-5: diagnostic and release/dev/UI/integration commands are excluded from required primary lifecycle but discoverable through family help/commands JSON. | Done | `tests/unit/lifecycle-guide.test.ts`; `hadara commands --requiredness primary --json` smoke |
| AC-5 | Phase 7.2 AC-7.2-6: `TASK_WORKFLOW_COMMANDS.md`, lifecycle help, and registry lifecycle stages agree. | Done | `docs/TASK_WORKFLOW_COMMANDS.md`; `tests/unit/lifecycle-guide.test.ts` |
| AC-6 | Phase 7.2 AC-7.2-7: tests cover at least five confusable command pairs. | Done | `tests/unit/command-portfolio-audit.test.ts` |
| AC-7 | Phase 7.2 AC-7.2-9: default help and lifecycle help exclude non-canonical compatibility aliases from the primary path. | Done | `tests/unit/help.test.ts`; `tests/unit/lifecycle-guide.test.ts` |
| AC-8 | HADARA close-source requirements: evidence is attached and state/handoff docs are updated before ready/close. | Done | Evidence records, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md` |
