# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/release-dry-run.ts` | Added | Read-only final release dry-run report and strong evidence cross-checks. |
| `src/services/release-evidence.ts` | Added | Shared release evidence record/artifact reader and schema validator. |
| `src/services/release-artifact-evidence.ts` | Added | Public reduced release artifact evidence attachment helper. |
| `src/cli/release-dry-run.ts` | Added | CLI handler for `hadara release dry-run --json`. |
| `src/cli/release-artifact.ts` | Updated | Added `--attach-evidence --task <task-id>` support. |
| `src/cli/main.ts` | Updated | Registered release dry-run help and dispatch. |
| `src/core/schema.ts` | Updated | Registered `hadara.releaseDryRun.v1`. |
| `src/schemas/release-dry-run.schema.json` | Added | JSON Schema fixture for dry-run reports. |
| `src/schemas/schema-index.json` | Updated | Indexed the new release dry-run schema. |
| `src/services/capability-registry.ts` | Updated | Exposed release dry-run and release artifact evidence attachment in tool discovery. |
| `tests/unit/release-dry-run.test.ts` | Added | Covers strong evidence artifact cross-checking and missing-artifact failure. |
| `tests/unit/release-artifact.test.ts` | Updated | Covers release artifact public evidence attachment. |
| `tests/unit/schema-runtime.test.ts` | Updated | Covers runtime validation for `hadara.releaseDryRun.v1`. |
| `tests/unit/schema-fixtures.test.ts` | Updated | Expects the new schema fixture. |
| `tests/unit/tools-list.test.ts` | Updated | Expects the new release dry-run capability. |
| `docs/TEST_STRATEGY.md` | Updated | Records implemented dry-run evidence hardening and attach command path. |
| `docs/RELEASE_READINESS.md` | Updated | Records implemented dry-run/cross-check boundaries. |
| `docs/SCHEMAS.md` | Updated | Documents `hadara.releaseDryRun.v1`. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Updated | Marks T-0140 done. |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Marks T-0140 done with evidence-backed scope. |
| `docs/PROJECT_STATE.md` | Updated | Adds current dry-run and release artifact evidence capabilities. |
