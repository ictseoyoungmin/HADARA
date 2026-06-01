# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Harness consumes evidence lint semantic issues instead of reparsing evidence semantics directly. | Accepted | Keeps one shared analyzer path and avoids rule drift. | `src/harness/validate.ts` |
| D-2 | Keep private-only substantive proof as a warning in harness validation. | Accepted | Matches Phase 4 first-rollout policy and avoids over-blocking private evidence. | docs/TEST_STRATEGY.md |
| D-3 | Do not add docs-scope historical semantic scans. | Accepted | T-0188 is scoped to task protocol and done-level harness gates. | docs/DEVELOPMENT_SLICES.md |
