# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0299-01 | Implement a dedicated `protocol migrate --target 0.3.0` surface rather than hiding migration behind `init upgrade`. | Accepted | Existing projects need a single adoption report across docs registry, command docs, managed markers, Required Reading, and selected Task Capsule scope; `init upgrade` remains profile scaffold creation. | `src/services/protocol-migration.ts`, `docs/specs/0.3.0/rc1/00_Protocol_Migration_for_0_3_Adoption.md`. |
| D-0299-02 | Keep `0.3.0-rc.1` publish out of this capsule. | Accepted | User requested feature/fix work first and a later final readiness capsule before publish. | README release status and T-0299 scope/out-of-scope. |
