# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/release-dry-run.ts` | Modify | Keep orchestration and report assembly while moving helper internals out. | Modified |
| `src/services/release-target-configuration.ts` | Add | Own release target config preview parsing and warning check generation. | Added |
| `src/services/release-provider-advisories.ts` | Add | Own provider advisory read model creation. | Added |
| `src/services/release-readiness-summary.ts` | Add | Own readiness counts and next-action generation. | Added |
| `src/services/release-diagnostics.ts` | Add | Own stage timing, stage status, and diagnostic advisory generation. | Added |
| `src/services/release-evidence-validation.ts` | Add | Own release evidence requirement validation, summaries, pass predicates, and git freshness checks. | Added |
| `tests/unit/release-target-configuration.test.ts` | Add | Cover target config default/unsupported/invalid preview behavior. | Added |
| `tests/unit/release-provider-advisories.test.ts` | Add | Cover Python advisory missing/present/stale behavior. | Added |
| `tests/unit/release-readiness-summary.test.ts` | Add | Cover readiness summary and next-action generation independently. | Added |
| `docs/RELEASE_READINESS.md` | Modify | Document that dry-run internals are service-decomposed while preserving no-mutation behavior. | Modified |
| `docs/PROJECT_STATE.md` | Modify | Record T-0260 state after completion. | Modified |
| `docs/AGENT_HANDOFF.md` | Modify | Record T-0260 handoff after completion. | Modified |
