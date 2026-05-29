# Acceptance Criteria

- [x] `hadara init` primary profiles are `basic`, `standard`, and `governed`, with `standard` as the default.
- [x] Unsupported profile names are rejected instead of retained as aliases.
- [x] Basic profile generates only core HADARA protocol docs and its SOP/AGENTS do not reference optional generated docs.
- [x] Standard profile generates the normal planning/validation docs and its SOP references only those generated docs plus core docs.
- [x] Governed profile generates the heavier governance docs and its SOP references the added docs conditionally.
- [x] Root `docs/IMPLEMENTATION_SOP.md` uses the same generalized profile model and records HADARA-dev as governed.
- [x] Focused init tests pass.
- [x] Docker `npm run check` passes.
- [x] Done-level harness validation for T-0148 passes.
- [x] Evidence is attached.
- [x] Handoff is updated.
