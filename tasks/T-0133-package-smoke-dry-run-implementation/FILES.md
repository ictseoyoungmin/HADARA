# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/package-smoke.ts` | Add | Build schema-valid dry-run package-smoke reports without execution. |
| `src/cli/package-smoke.ts` | Add | Expose `hadara package smoke --dry-run --json`. |
| `src/cli/main.ts` | Update | Route the package-smoke command and help text. |
| `src/services/capability-registry.ts` | Update | Advertise the read-only package-smoke dry-run surface. |
| `tests/unit/package-smoke-dry-run.test.ts` | Add | Cover dry-run report shape, redaction, no-execution markers, and CLI JSON. |
| `tests/unit/tools-list.test.ts` | Update | Assert tools-list reports the package-smoke dry-run surface. |
| `docs/TEST_STRATEGY.md` | Update | Clarify T-0131 service/read-model smoke versus future installed/package smoke execution. |
| `docs/RELEASE_READINESS.md` | Update | Keep release-readiness wording aligned with the T-0131 boundary. |
