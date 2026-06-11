# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0291 |
| Status | Implementation complete; close pending |
| Last Updated | 2026-06-11 |

## Last Completed

| Item | Evidence |
|---|---|
| T-0290 staged Phase 7 specs and established Phase 7.1 as the next implementation capsule. | Commit `59d676d`; `docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md` |
| T-0291 capsule created and scoped to registry-backed help/commands/tools-list projection. | This capsule document set |
| Phase 7.1 registry/help/commands implementation complete with focused validation evidence. | `EVIDENCE.md`; `tests/unit/command-registry.test.ts`; `tests/unit/help.test.ts`; `tests/unit/tools-list-command-registry.test.ts` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Finish close/ready/audit for T-0291, commit, then create Phase 7.2 capsule. | Phase 7.1 implementation is complete; Phase 7.2 is next in the staged Phase 7 sequence. | `docs/specs/0.3.0/03_Phase_7_2_Lifecycle_Guide_and_Command_Portfolio_Audit.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not create a second command metadata source. | Phase 7.1 acceptance requires one authoritative registry. | Add render/projection helpers only; metadata belongs in `capability-registry.ts`. |
| Do not remove or rename command handlers in this capsule. | Compatibility decisions are Phase 7.2 work. | Mark aliases/non-canonical surfaces in registry metadata only. |
| Full suite has residual timeout-only failures in dashboard/dogfooding tests under Docker direct Vitest. | These are not Phase 7.1 command registry assertion failures, but they prevent a clean full-suite evidence record. | Keep blocked evidence with next step to investigate timeout/performance before release hardening. |
