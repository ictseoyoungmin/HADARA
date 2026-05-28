# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/install-plan.ts` | Add | Build schema-validated read-only install dry-run planning reports. |
| `src/cli/install.ts` | Add | Expose `hadara install plan` CLI output. |
| `src/cli/main.ts` | Update | Route the new install command and help text. |
| `src/services/capability-registry.ts` | Update | Mark `hadara install plan --json` as a read-only capability. |
| `package.json` | Update | Record MIT package metadata without making the private package publishable. |
| `package-lock.json` | Update | Keep root package lock metadata aligned with `package.json`. |
| `tests/unit/install-plan.test.ts` | Add | Cover schema validity, redaction, execute-disabled behavior, and CLI JSON output. |
| `tasks/T-0129-installer-dry-run-implementation/*` | Update | Replace scaffold docs and record evidence. |
| `docs/PROJECT_STATE.md` | Update | Record the new installer dry-run plan surface when complete. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark T-0129 complete when validation passes. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Update | Reflect the completed installer dry-run implementation. |
| `docs/TASK_BOARD.md` | Update | Track T-0129 status. |
| `docs/AGENT_HANDOFF.md` | Update | Capture completion state, validation, and next step. |
