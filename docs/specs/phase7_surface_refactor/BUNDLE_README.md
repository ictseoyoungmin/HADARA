# HADARA 0.3.0 Phase 7 Surface Refactor Spec Bundle

This bundle rewrites the previous 0.3.0 surface-refactor plan as a Phase 7.x program.

Important terminology:

- `Phase 7.x` labels are internal implementation phases after the already-planned Phase 6.1 work.
- They are not external npm release-candidate labels.
- Do not publish a new release after an individual Phase 7.x slice.
- The next external release should be prepared only after all required Phase 7.x slices pass Phase 7.6 release hardening and installed-package recycle.

Copy the `docs/` directory into the HADARA repository root.
Do not copy this bundle README over the repository root `README.md`.

Primary spec files:

```text
docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md
docs/specs/0.3.0/01_Phase_7_0_Repo_State_Reconciliation_and_Planning_Staging.md
docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md
docs/specs/0.3.0/03_Phase_7_2_Lifecycle_Guide_and_Command_Portfolio_Audit.md
docs/specs/0.3.0/04_Phase_7_3_Document_Registry_and_Docs_Doctor.md
docs/specs/0.3.0/05_Phase_7_4_Managed_Sections_and_Safe_Patch_Plans.md
docs/specs/0.3.0/06_Phase_7_5_Docs_Cleanup_Operations.md
docs/specs/0.3.0/07_Phase_7_6_0_3_0_Release_Hardening_and_Installed-Package Validation.md
```

Implementation guide files:

```text
docs/specs/0.3.0/implementation_guides/SPEC_AUTHORING_RULES.md
docs/specs/0.3.0/implementation_guides/WORKER_AGENT_INSTRUCTIONS.md
docs/specs/0.3.0/implementation_guides/README_UPDATE_INSTRUCTIONS.md
```
