# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Per-file cache shape becomes a second source of truth. | Stale summaries could produce misleading code graph output. | Medium | Validate each per-file summary against source fingerprint/extractor version; recompute on missing/corrupt/mismatch. | Open |
| Optimization broadens into parser rewrite. | Scope creep could delay C5 work. | Medium | Keep existing deterministic extraction semantics; only cache/reuse extraction results. | Open |
| Cache warm execute still performs broad source discovery on mounted workspaces. | Per-file reuse may reduce parsing but not all mounted latency. | Medium | This capsule targets changed-file recompute; source-manifest fast path remains from T-0368 and future work can further optimize discovery. | Open |
| Tests accidentally rely on wall-clock speed. | Flaky CI/local validation. | Low | Assert reuse/recompute counters/cache metadata and file snapshots instead of timing thresholds. | Open |
| Read commands write per-file cache as a side effect. | Violates C6 non-negotiable and cache write boundary. | Low | Add no-write snapshot tests for include-code graph read. | Open |
