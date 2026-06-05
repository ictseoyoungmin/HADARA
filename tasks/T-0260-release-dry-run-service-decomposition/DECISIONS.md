# Decisions

| Decision | Rationale |
|---|---|
| Keep `ReleaseDryRunReport` in `release-dry-run.ts` for T-0260. | Avoid a larger type migration while keeping the public report contract unchanged. Extracted modules import the type only. |
| Add focused service-level tests without changing schema fixtures. | The report shape is unchanged; schema-runtime and release dry-run regressions cover compatibility. |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
