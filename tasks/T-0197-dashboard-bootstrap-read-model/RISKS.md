# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Bootstrap response still includes full ops status. | First-paint payload is better than fan-out but not yet minimal for very large projects. | Medium | T-0198/T-0199/T-0201 can progressively reduce frontend dependency and add cache/detail split. | Accepted |
| No real TTL cache yet. | Repeated refresh still recomputes read models. | Medium | T-0201 owns process-memory TTL cache; T-0197 exposes disabled cache metadata only. | Deferred |
| Selected-task summary duplicates some lint/workbench computation. | Bootstrap with selected task may be slower than pure status bootstrap. | Low | The summary is compact, optional, and will move to dedicated task-detail aggregation in T-0199. | Accepted |
