# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep the lint report schema version as `hadara.evidence.lint.v1`. | Accepted | The integration is additive and compatibility-first. | docs/SCHEMAS.md |
| D-2 | Add `summary.semantics` but do not expose `normalizedRecords` in T-0187. | Accepted | Semantic aggregate data is useful for consumers; omitting normalized records avoids accidental private-path exposure and keeps payload churn smaller. | docs/SECURITY_MODEL.md |
| D-3 | Emit semantic lint issues only for Done-looking tasks. | Accepted | Draft tasks should still get summaries without premature blockers. | T-0186 analyzer contract |
| D-4 | Do not accept failed-evidence resolution from free-text keywords. | Accepted | Exact markers or later passed same-category evidence reduce false resolution. | docs/TEST_STRATEGY.md |
| D-5 | Represent legacy v1 presence in `summary.semantics.legacyRecords` instead of lint `issues`. | Accepted | Every current record is v1, so emitting a compatibility info issue would make ready/close reports noisy without adding actionability. | Focused evidence-lint tests |
