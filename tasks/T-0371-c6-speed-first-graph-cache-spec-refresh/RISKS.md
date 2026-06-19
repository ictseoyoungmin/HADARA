# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Spec duplicates existing C6 07 content. | Future workers may read two overlapping specs and lose the speed-first priority. | Medium | 08 is explicitly framed as the execution-focused follow-up and 07 cross-links to it. | Mitigated |
| Graphify comparison could imply adopting generated graph truth. | Would conflict with HADARA proof/state/evidence boundaries. | Low | The spec separates adopted ideas from non-adopted behaviors and repeats cache-is-not-truth rules. | Mitigated |
| Performance targets may be too aggressive for mounted workspaces. | Future implementation may fail targets before cache shards are complete. | Medium | Targets allow degraded ceilings and require measured cache/degraded metadata rather than silent slowness. | Accepted |
