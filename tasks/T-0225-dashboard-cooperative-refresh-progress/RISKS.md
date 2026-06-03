# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Freshness checks could become another broad scan. | Core route would regress to slow `/mnt/f` behavior. | Medium | Derive stale/pending from existing projection metadata and refresh progress; defer expensive freshness proof. | Mitigated |
| Progress metadata can look precise while stages are coarse. | Operators may over-trust progress percentages. | Medium | Report stage-local `processed/total` and `currentStage` honestly; use null totals when not knowable. | Mitigated |
| Frontend refresh could accidentally wait for completion. | UI would blank or spin until background rebuild finishes. | Medium | Refresh button now triggers `/api/dashboard/refresh`, keeps current runtime, then reads current core opportunistically. | Mitigated |
| Timing tests can be flaky on slow filesystems. | False failures in CI or Docker. | Medium | Deterministic unit checks cover route selection/progress fields; built route smoke observes behavior without tight thresholds. | Mitigated |
| Full source freshness is still bounded by cheap metadata. | A projection can be honestly marked stale/unknown rather than proven fresh if proving freshness would require broad scans. | Medium | Keep core non-blocking and use explicit refresh progress/status; future work can add cheap per-source manifests if needed. | Carry Forward |
