# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 7 surface-refactor context. | Done | Read AGENTS-required docs, `docs/specs/0.3.0`, and active T-0299 capsule files. |
| 2 | Write rc1 protocol migration spec. | Done | `docs/specs/0.3.0/rc1/00_Protocol_Migration_for_0_3_Adoption.md`. |
| 3 | Implement `protocol migrate --target 0.3.0` project/task scoped dry-run-first migration. | Done | `src/services/protocol-migration.ts`, `src/cli/protocol.ts`, schema, registry, and tests. |
| 4 | Align README and package metadata for deferred rc.1 publish. | Done | README install targets published rc.0; package/release artifact metadata points at public `HADARA` repo. |
| 5 | Run focused validation and built CLI smokes. | Done | Focused Docker tests passed; TypeScript build passed; built CLI migration execute smoke passed. |
| 6 | Run full Docker validation and refresh `dist`. | Done | Full Docker check built TypeScript and passed 115 files / 746 tests before dashboard bootstrap/static parallel timeout; standalone dashboard retry passed; `dist` refreshed and version smoke passed. |
| 7 | Attach evidence, finish/close capsule, and commit. | Pending | Evidence attached; finish/ready/close/audit and commit remain. |
