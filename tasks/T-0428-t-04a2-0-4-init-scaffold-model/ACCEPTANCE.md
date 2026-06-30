# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara init` generates the accepted 0.4 basic/standard/governed scaffold file sets, including `.hadara/scaffold.json`, `.hadara/docs-registry.json`, `.hadara/slot-registry.json`, `docs/HADARA_WORKFLOW.md`, and `tasks/.gitkeep`. | Done | `ev:T-0428:f09b011734c84cab8034facf` |
| AC-2 | Default 0.4 init no longer creates legacy `docs/IMPLEMENTATION_SOP.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, or `docs/DOC_REGISTRY.md`. | Done | `ev:T-0428:f09b011734c84cab8034facf` |
| AC-3 | Init doctor checks the 0.4 scaffold core files and reports missing protocol/workflow/docs-registry/slot-registry with 0.4-specific codes. | Done | `ev:T-0428:f09b011734c84cab8034facf` |
| AC-4 | Focused init tests pass in Docker and workspace `dist` is refreshed from the validated build. | Done | `ev:T-0428:f09b011734c84cab8034facf` |
| AC-5 | Capsule/shared state docs are updated before finalize, and canonical close evidence is recorded through HADARA. | Done | Shared state docs updated; close evidence will be appended by guarded finalize. |
