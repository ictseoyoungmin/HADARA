# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0647 |
| Title | 0.5.0 session-start removal and cross-profile dogfood |
| Status | Done |
| Created | 2026-07-18T17:41 |
| Updated | 2026-07-18T17:53 |
## Last Completed

| Item | Evidence |
|---|---|
| Removed residual current `session start` ingress wording from `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, internal adapter guidance, and context-routing smoke workloads. | ev:T-0647:e4829fc7f41346409c716ea0, ev:T-0647:7d5adbb50e4c4539a5677fc6 |
| Cross-profile disposable dogfood passed for basic, standard, and governed profiles using status-first ingress. | ev:T-0647:18e10b0efc3e4dfe94a9c6d8 |
| Focused tests, TypeScript build, and built CLI status-first smoke passed. | ev:T-0647:e4829fc7f41346409c716ea0, ev:T-0647:3d00d5c078404df189771aaa, ev:T-0647:7d5adbb50e4c4539a5677fc6 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue with the next 0.5.0 capsule after recording validation and closing T-0647. | 050-C05/C06 are complete unless validation uncovers regressions. | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical `hadara.sessionStart.v1` implementation files remain. | They can look stale in broad grep output, but public routing/guidance/smokes no longer teach them. | Treat them as implementation history unless a later cleanup explicitly deletes the schema and adapter tests. |
