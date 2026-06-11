# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | rc1 protocol migration spec exists under `docs/specs/0.3.0/rc1` and is registered in project docs. | Done | Spec added; `docs/IMPLEMENTATION_SOP.md`, `docs/specs/0.3.0/00...`, and `docs/SCHEMAS.md` updated. |
| AC-2 | `hadara protocol migrate --target 0.3.0 --json` emits schema-valid dry-run project-scope plans with detection, actions, and `summary.beforeHash`. | Done | `tests/unit/protocol-migration.test.ts`; focused Docker tests passed. |
| AC-3 | Execute mode requires reviewed `--before-hash` and rechecks bounded writes. | Done | Unit tests cover missing/stale hash; built CLI execute smoke returned `ok:true`, `changed:3`, and protocol marker present. |
| AC-4 | `--task <id>` limits migration to selected Task Capsule scope. | Done | Unit test confirms task evidence index/status-history marker writes and no project docs registry write. |
| AC-5 | Command registry and schema registry expose `protocol.migrate`. | Done | `tests/unit/command-registry.test.ts`, `tests/unit/schema-fixtures.test.ts`, and `tests/unit/protocol-cli.test.ts`. |
| AC-6 | README and package metadata are consistent with deferred rc.1 publish. | Done | README install uses published rc.0 while source candidate remains rc.1; package/release artifact metadata points to public `HADARA` repo. |
| AC-7 | Full validation and capsule close evidence are recorded. | Done | Evidence records cover focused tests, full-check result with standalone dashboard retry, built CLI migration execute smoke, and workspace dist version smoke; close/audit to be appended by task workflow commands. |
