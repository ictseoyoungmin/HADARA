# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | T-0317 exact npx finding is resolved or documented as environment/path-trust behavior. | Done | README and TEST_STRATEGY document exact `npx` as convenient but not the strongest proof when PATH/cache/DNS are suspect. |
| AC-2 | Temp-prefix installed-bin path is documented as canonical consumer proof. | Done | README install guidance and TEST_STRATEGY installed-package section. |
| AC-3 | Fresh governed docs doctor warning is removed or intentionally documented. | Done | Fresh governed required-reading doctor returned no issues after generated Required Reading and parser changes. |
| AC-4 | Focused tests cover init/docs doctor/required-reading behavior. | Done | Focused Docker validation passed 5 files / 55 tests. |
| AC-5 | Evidence is attached. | Done | `command:T-0321:docker-focused-docs-init-profile`; `command:T-0321:docker-full-sync-build`; `command:T-0321:repo-docs-harness-smokes`. |
| AC-6 | Shared handoff known problems reflect the new state. | Done | AGENT_HANDOFF now routes Phase 8.4 next and reclassifies the T-0317 findings as resolved/reclassified. |
