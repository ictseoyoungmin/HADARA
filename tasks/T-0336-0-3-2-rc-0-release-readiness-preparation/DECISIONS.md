# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prepare `hadara@0.3.2-rc.0` source/readiness without publish mutation. | Accepted | T-0336 is release readiness; T-0337 owns approval-gated publish. | T-0336 capsule spec |
| D-2 | Use Docker sync-build as the source/test/dist baseline before release artifact and smoke checks. | Accepted | Version and generated-doc source changes require fresh `dist` before package checks. | T-0336 capsule spec |
