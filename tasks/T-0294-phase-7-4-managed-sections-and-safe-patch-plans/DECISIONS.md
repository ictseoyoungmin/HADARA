# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement `docs patch` as section-body replacement only. | Accepted | Phase 7.4 requires managed-body-only patching and no marker removal; row-specific operations can be layered later on the same section boundary. | `src/services/managed-sections.ts`, docs patch tests |
| D-2 | Add markers only to safe generated/tabular sections in fresh init and fresh task scaffolds. | Accepted | Broad prose docs remain human-authored and unmanaged by default. | init and managed section tests |
| D-3 | Preserve legacy bounded writes when markers are absent. | Accepted | Existing projects must keep working without marker bootstrap. | task finish focused tests |
