# Plan

1. Read required HADARA protocol docs and v1.0 service parity planning references.
2. Create the T-0085 Task Capsule through the HADARA CLI.
3. Move Operations Status JSON report creation from the CLI helper into `src/services/operations-status-service.ts`.
4. Keep `src/cli/status-json.ts` as a compatibility export and route CLI status commands through the shared service.
5. Update focused status tests to import the shared service boundary.
6. Run focused status tests, full Docker check, CLI status smokes, and done-level harness validation.
7. Record evidence and update task/project handoff documents.
