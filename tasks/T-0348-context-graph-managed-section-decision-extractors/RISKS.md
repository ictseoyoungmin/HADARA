# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Project decisions use legacy prose headings while task decisions use tables. | A single parser style would miss one class of decision. | High | Support both `## D-...` headings and table rows beginning with `D-`. | Accepted |
| KnownProblem extraction is currently handoff-current-state only. | Task-local carry-forward warnings are not represented yet. | Medium | Keep C1 explicit to `docs/AGENT_HANDOFF.md`; add task-local warning extraction later if graph assembly needs it. | Carry Forward |
| Managed section target discovery is bounded. | Unregistered ad hoc managed markers outside known docs/task capsules are not extracted. | Low | Use project managed targets and Task Capsule TASK/HANDOFF files for this source slice; broaden through docs registry if needed later. | Accepted |
