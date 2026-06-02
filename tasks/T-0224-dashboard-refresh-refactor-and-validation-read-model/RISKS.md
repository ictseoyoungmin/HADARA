# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Validation extraction can regress independently across core/status/timeline. | Home activity may show old T-0096 validation again. | Medium | Shared `handoff-summary-parser` now handles table/list sections and validation baseline extraction for core/status/timeline consumers. | Mitigated |
| Async refresh tests can become timing-sensitive. | Fake timer tests may miss real `fs.promises` completion. | Medium | Refresh unit tests use real timer polling for async heavy refresh and keep focused route smoke for built `dist`. | Mitigated |
| Dashboard debt projection no longer includes full operational-debt capsule scan issues. | Dashboard debt route is less detailed than release/debt surfaces. | Low | Spec explicitly scopes dashboard debt projection to aggregate counts; full capsule-size and premature-acceptance checks remain in operational-debt/release read models. | Accepted |
| Done-level validation can miss incomplete Task Capsule metadata if only prose placeholders are checked. | A capsule can be marked Done while `TASK.md` still shows `Created`/`Updated` as `TBD`. | Medium | Done-level harness now blocks missing, blank, `TBD`, or non-`YYYY-MM-DD` Created/Updated metadata; completed test fixtures were updated to satisfy the same contract. | Mitigated |
| Already-running dashboard server can still use old in-memory code. | Browser may keep showing old T-0096 until server restart. | Medium | `dist` is refreshed; restart dashboard server after this CLI/service change. | Carry Forward |
