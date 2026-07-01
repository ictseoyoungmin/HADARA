# T-0470 Full diagnostics finalize performance optimization

## Identity

| Field | Value |
|---|---|
| ID | T-0470 |
| Title | Full diagnostics finalize performance optimization |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/task/task-close.ts | implementation-source | approved | implemented | sha256:1e9f8893025f72ed29ebec6566c343666cfeb44a19df846ae9891a95270162d8 | Close planning, close-source hashing, and audit-close path. |
| src/task/task-finalize.ts | implementation-source | approved | implemented | sha256:e9cf2440e2e84462940b74cd7330d95b56d84e739b47ca6e2459eb47ac8e5175 | Finalize orchestration and repeated close/audit composition. |
| src/task/task-lifecycle.ts | implementation-source | approved | implemented | sha256:5a6a12383841207b349f49243d7b039445d0137657280bf86d3e1ed0f288e4f8 | Legacy lifecycle composition that can share close plans. |
| src/task/task-complete-flow.ts | implementation-source | approved | implemented | sha256:26016c1adbf69f2147136507b28df1d4b2a47d09551db24672d0069d26ff5c6a | Legacy complete-flow composition that can share close plans. |
| src/task/task-close-repair-plan.ts | implementation-source | approved | implemented | sha256:a1e2b1e861834c87deed3cb549e56c8af197ccd3ec03a34cd95a38cb02c60f29 | Internal close repair composition that can share close plans. |
| src/harness/validate.ts | implementation-source | approved | implemented | sha256:f20e863fc28fc6f2524e2410c5dd85b029b7a392fa6f69ecef821360e4bf6d33 | Done-level harness validation currently used by close planning. |
| src/services/protocol-consistency.ts | implementation-source | approved | implemented | sha256:57ac07a8eb1c5a25c99304c09f4537d465a237291eb47cb545ce4a9c8c367c5c | Task-scope protocol consistency currently used by close planning. |
| src/services/task-workbench.ts | reference | approved | implementing | sha256:484335da48976a32cad89ca657213196cadb9b55a74c2907d91bd485cbc23fed | Full task status path and explicit diagnostics UX. |

## Goal

| Goal | Notes |
|---|---|
| Reduce explicit full diagnostics and finalize latency on mounted workspaces without weakening close proof semantics. | Focus on task-scoped exact lookup and avoiding repeated close-plan work in finalize/audit paths; leave broad global docs doctor optimization as a follow-up if still slow. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Reproduce mounted full status/finalize/audit latency against a closed capsule. | Done | T-0470 measured T-0469 full status, finalize, and audit-close before edits. |
| 2 | Replace task-scoped full-list scans with exact task capsule lookup where semantics are unchanged. | Done | ev:T-0470:00190a9390e54a3db393d461 |
| 3 | Reuse close-plan data inside audit/finalize where possible to avoid duplicate close-grade validation. | Done | ev:T-0470:00190a9390e54a3db393d461 |
| 4 | Validate focused tests, build, built CLI smokes, and done-level harness. | In Progress | ev:T-0470:00190a9390e54a3db393d461; ev:T-0470:f5fc721056374e47b4a4ea43; ev:T-0470:b0beb3b22fea47f1b51b7c78 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Task-scoped close, audit-close, harness, and task protocol checks avoid scanning all task capsules for exact task lookup. | Yes | Met | ev:T-0470:00190a9390e54a3db393d461 | Required | src/task/task-close.ts; src/harness/validate.ts; src/services/protocol-consistency.ts |
| AC-2 | Finalize/audit-close avoids recomputing an equivalent close dry-run when a current close plan is already available in the same call path. | Yes | Met | ev:T-0470:00190a9390e54a3db393d461 | Required | src/task/task-finalize.ts; src/task/task-close.ts |
| AC-3 | Existing close/finalize/workbench behavior remains covered by focused tests. | Yes | Met | ev:T-0470:00190a9390e54a3db393d461 | Required | tests/unit/task-close.test.ts; tests/unit/task-finalize.test.ts; tests/unit/task-workbench.test.ts |
| AC-4 | Built CLI smokes show explicit full diagnostics/audit-close are materially faster on the mounted workspace, with expected drift classified when prior capsules reference files changed by this capsule. | Yes | Met | ev:T-0470:b0beb3b22fea47f1b51b7c78 | Required | built CLI smoke evidence |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Pre-change baseline | node dist/cli/main.js task status --task T-0469 --detail full --json; node dist/cli/main.js task finalize --task T-0469 --json; node dist/cli/main.js task audit-close --task T-0469 --json | Yes | Passed | T-0470 pre-change measurements: full status 20749 ms, finalize 25338 ms, audit-close command elapsed about 15.6s. |
| Focused unit tests | Docker focused vitest for close/finalize/workbench/protocol/harness tests | Yes | Passed | ev:T-0470:00190a9390e54a3db393d461 |
| Build/dist refresh | Docker build and refresh workspace dist | Yes | Passed | ev:T-0470:f5fc721056374e47b4a4ea43 |
| Built CLI smoke | Built CLI full status/finalize/audit-close against T-0469 plus git diff check | Yes | Passed | ev:T-0470:b0beb3b22fea47f1b51b7c78 |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/task/task-close.ts | module:close planning | Replaced all-task capsule scans with exact lookup and added internal audit closePlan reuse option. | Avoid mounted broad reads in task-scoped close/audit paths. | ev:T-0470:00190a9390e54a3db393d461 |
| src/harness/validate.ts | module:harness validate | Switched task lookup to exact capsule lookup. | Avoid scanning all task capsules for one task validation. | ev:T-0470:00190a9390e54a3db393d461 |
| src/services/protocol-consistency.ts | module:task protocol doctor | Switched task-scoped report lookup to exact capsule lookup. | Avoid scanning all task capsules for one task protocol report. | ev:T-0470:00190a9390e54a3db393d461 |
| src/task/task-finalize.ts | module:finalize reports | Passed existing close plan into audit composition. | Avoid duplicate close-grade validation before audit. | ev:T-0470:00190a9390e54a3db393d461 |
| src/task/task-lifecycle.ts | module:legacy lifecycle | Reused close plan for ready/audit composition. | Reduce duplicated diagnostics in compatibility lifecycle report. | ev:T-0470:00190a9390e54a3db393d461 |
| src/task/task-complete-flow.ts | module:legacy complete flow | Reused close plan for ready/audit composition. | Reduce duplicated diagnostics in compatibility complete flow. | ev:T-0470:00190a9390e54a3db393d461 |
| src/task/task-close-repair-plan.ts | module:internal repair plan | Reused close plan for audit composition. | Keep internal repair diagnostic cheaper if used directly. | ev:T-0470:00190a9390e54a3db393d461 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Global docs/profile protocol diagnostics may still be broad-scan heavy for explicit `--detail full`; this capsule only optimizes task-scoped close/finalize paths. | Open | docs/AGENT_HANDOFF.md |
| RF-2 | Follow-up | Some older `protocol-consistency.test.ts` fixtures still assume legacy multi-file task capsules such as `FILES.md` and `ACCEPTANCE.md`; the broad protocol fixture suite failed before focused current-path validation passed. | Open | ev:T-0470:f3e6a00d1403443381b66ebd; ev:T-0470:00190a9390e54a3db393d461 |
