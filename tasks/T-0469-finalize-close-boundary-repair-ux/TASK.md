# T-0469 Finalize close-boundary repair UX

## Identity

| Field | Value |
|---|---|
| ID | T-0469 |
| Title | Finalize close-boundary repair UX |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/task/task-finalize.ts | implementation-source | approved | implemented | sha256:350a3bc91ef854fce690efdb004661f3b52546905d0fe064042e3e0f49233aad | Finalize plan/execute semantics. |
| src/cli/task.ts | implementation-source | approved | implemented | sha256:2f5ca277ad1b92c4380378e942bfe9435c2f22e189d2d6130b23f071b7117d73 | Task command routing. |
| src/services/task-workbench.ts | implementation-source | approved | implemented | sha256:484335da48976a32cad89ca657213196cadb9b55a74c2907d91bd485cbc23fed | Status next-action guidance. |
| src/services/workbench-next-actions.ts | implementation-source | approved | implemented | sha256:c305a6e7f33436063aa317b2eafc84122cb5697f74d408ee82b27891910f325c | Shared workbench next-action policy. |
| src/services/dashboard-task-detail.ts | implementation-source | approved | implemented | sha256:b64efa4a2ee91d12e86b312b0bfd0c4492bd8657a9176f8b50f2340a95459d49 | Dashboard selected-task next-action policy. |
| src/services/capability-registry.ts | implementation-source | approved | implemented | sha256:cb4586115753d87b7dd2e6fda10dc28dbd3d595a3de43b59a5b3c69ee4aa161b | Command registry/help surface. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | approved | implemented | sha256:febd7236ad7d9faf88f26eda2b8507fdcbc2aeb4406d2f888f5f00d54f289402 | Agent-facing lifecycle guidance. |
| docs/CLI_JSON_CONTRACT.md | reference | approved | implemented | sha256:d1ba111273c7e0a908032f3d7d89225f56b2f994ede7c59367b2ec0bdf2dee63 | JSON command contract. |
| docs/IMPLEMENTATION_SOP.md | reference | approved | implemented | sha256:488b917b3d46148c93ed043ef71b65bd95d135766787978fe4603f30fff8ae7f | Current repo workflow guidance. |
| src/cli/init.ts | implementation-source | approved | implemented | sha256:b71e97bb20c4ad8a36809a5b422ac063f1a17fbff0a444cb107bdf307201374d | Generated workflow scaffold text. |

## Goal

| Goal | Notes |
|---|---|
| Make finalize own close-boundary repair UX so ordinary workers never need `close-repair-plan`, `task close`, or `audit-close` after finalize reports `closed-valid`. | Stale close proof should be repaired through the reviewed finalize plan/execute path, and closed-valid status/finalize reports should have no required follow-up action. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the finalize repair and closed-valid stop contract. | Done | This task contract. |
| 2 | Update finalize/status/registry/docs to make finalize the repair path and hide low-level repair from ordinary guidance. | Done | ev:T-0469:557a38f24fca4928a1893911 |
| 3 | Validate focused finalize/workbench/registry/schema behavior and record evidence. | Done | ev:T-0469:557a38f24fca4928a1893911; ev:T-0469:95dfca9fc3c24f79b75bfec5; ev:T-0469:efd716488ee4420cb7d94697 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `task finalize --json` classifies stale close proof as a finalize repair plan that appends fresh close evidence through guarded finalize execute, not a `close-repair-plan` handoff. | Yes | Met | ev:T-0469:557a38f24fca4928a1893911 | Required | src/task/task-finalize.ts |
| AC-2 | `task status --task` returns no next action when the task is closed-valid; invalid/stale close proof guidance points back to finalize rather than audit/close-repair commands. | Yes | Met | ev:T-0469:557a38f24fca4928a1893911; ev:T-0469:efd716488ee4420cb7d94697 | Required | src/services/task-workbench.ts |
| AC-3 | Default command registry/docs no longer present `task close-repair-plan` as an agent-facing lifecycle command. | Yes | Met | ev:T-0469:557a38f24fca4928a1893911; ev:T-0469:efd716488ee4420cb7d94697 | Required | src/services/capability-registry.ts |
| AC-4 | Focused tests and built CLI smokes cover finalize repair, closed-valid stop, and command-surface guidance. | Yes | Met | ev:T-0469:557a38f24fca4928a1893911; ev:T-0469:95dfca9fc3c24f79b75bfec5; ev:T-0469:efd716488ee4420cb7d94697 | Required | tests/unit/task-finalize.test.ts |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused unit tests | Docker Vitest for finalize/workbench/registry/help/schema tests. | Yes | Passed | ev:T-0469:557a38f24fca4928a1893911 |
| Build | Docker TypeScript build and workspace dist refresh. | Yes | Passed | ev:T-0469:95dfca9fc3c24f79b75bfec5 |
| Built CLI smoke | `node dist/cli/main.js` status/help smokes and diff check. | Yes | Passed | ev:T-0469:efd716488ee4420cb7d94697 |
| Diagnostic smoke | `node dist/cli/main.js task finalize --task T-0468 --json`. | No | Blocked | Expected source-doc drift; ev:T-0469:60ff3eeb611b4cea9374a945; ev:T-0469:dd76f37be5c9401ca06497a4 |
| Done-level harness | `node dist/cli/main.js harness validate --task T-0469 --level done --json`. | Yes | Passed | ev:T-0469:a66f5a34ea454e78a72af437 |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/task/task-finalize.ts | module:finalize repair | Make stale close proof repair a finalize plan/execute path. | Avoid separate repair command handoff in ordinary lifecycle. | ev:T-0469:557a38f24fca4928a1893911 |
| src/services/task-workbench.ts | module:task status | Stop suggesting audit for closed-valid and route close-proof problems to finalize. | Closed-valid should mean no further lifecycle action. | ev:T-0469:557a38f24fca4928a1893911 |
| src/services/workbench-next-actions.ts | module:next actions | Make closed-valid return no next actions and convert close evidence repair to finalize. | Shared policy must match task status. | ev:T-0469:557a38f24fca4928a1893911 |
| src/services/dashboard-task-detail.ts | module:dashboard detail | Align dashboard task detail next actions with finalize-first repair. | UI read model should not suggest low-level audit after closed-valid. | ev:T-0469:557a38f24fca4928a1893911 |
| src/cli/task.ts | command routing | Remove direct `task close-repair-plan` CLI routing. | Hide low-level repair classifier from public command flow. | ev:T-0469:557a38f24fca4928a1893911 |
| src/services/capability-registry.ts | command surface | Remove default/agent-facing close-repair-plan command guidance. | Registry-backed help should teach finalize repair. | ev:T-0469:557a38f24fca4928a1893911 |
| docs/TASK_WORKFLOW_COMMANDS.md | workflow docs | Document finalize-owned repair and closed-valid stop behavior. | Keep agent guidance consistent with code. | ev:T-0469:efd716488ee4420cb7d94697 |
| src/cli/init.ts | generated docs | Remove generated close-repair-plan guidance and route repair to finalize. | Fresh scaffolds should not teach old repair flow. | ev:T-0469:557a38f24fca4928a1893911 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Full diagnostics/finalize mounted workspace performance remains separate from this UX repair. | Open | docs/AGENT_HANDOFF.md |
