# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Change the default init scaffold file list directly for 0.4 instead of adding a legacy compatibility flag. | Accepted | The 0.4 spec is a breaking productization redesign, and the shortest correct path is to make the default generated scaffold match it. | `01_Project_Scaffold_Model.md` |
| D-2 | Keep detailed AGENTS/HADARA_WORKFLOW/HADARA_CONTEXT prose refinement out of T-04A2 unless required by tests. | Accepted | T-04A3 owns agent entry and workflow templates; T-04A2 owns scaffold model and metadata. | `14_Worker_Agent_Capsule_Plan.md` |
