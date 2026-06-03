# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| TUI still has legacy raw task detail/cache reads after this slice. | Some TUI paths may continue to differ from Dashboard until follow-up replacements land. | Medium | Keep this slice additive and document deferred replacements for task detail, timeline/debt, and cache task index. | Open |
| Dashboard core service writes projections by default. | TUI ordinary reads could mutate `.hadara/local/cache/dashboard` and violate read-only snapshot expectations. | Medium | Add a `writeProjection: false` option and use it from TUI operator reads. | Mitigated |
| Header projection status could crowd narrow terminals. | Visible operator status may be clipped. | Medium | Use existing fixed-width `fitAnsi` clipping; keep details short and bounded. | Mitigated |
| Full dashboard optimization could resume by inertia. | TUI roadmap value may be delayed. | Medium | Record dashboard freeze/deferred list in spec, project state, and handoff. | Mitigated |
