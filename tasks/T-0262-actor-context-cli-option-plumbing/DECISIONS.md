# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a shared CLI actor parser instead of per-command parsing. | Accepted | Keeps option names and role validation consistent across Phase 6.1 surfaces. | `src/cli/actor.ts`. |
| D-2 | Keep actor input optional and additive. | Accepted | Existing default actor reports remain valid and consumers are not forced to provide multi-agent metadata. | Focused tests preserve default actor assertions. |
| D-3 | Do not add scheduler, assignment, or routing behavior. | Accepted | T-0262 only strengthens report attribution; runtime coordination remains out of scope. | Phase 6.1 spec non-goals. |
