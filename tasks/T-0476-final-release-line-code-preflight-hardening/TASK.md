# T-0476 Final release-line code preflight hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0476 |
| Title | Final release-line code preflight hardening |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/services/ci-gate.ts | implementation-source | approved | implemented | sha256:e28a53375183c19387c546c42c2bc5b11e5829367068bb0bfeff20f02300f995 | CI gate task selection path. |
| tests/unit/ci-gate.test.ts | implementation-source | approved | implemented | sha256:14430f24a09e35ff841b4d6250ccba0a8bff2e0acdc8a00f6ee58faa22bbdab4 | CI gate fixture coverage. |
| tests/unit/release-closeout.test.ts | implementation-source | approved | implemented | sha256:e94326a188736c86c3e90cd04d0a3bf1b4e548e60d70104121fddf055e1cbcf7 | Current release closeout surface count fixture. |

## Goal

| Goal | Notes |
|---|---|
| Harden the last non-release code path before explicit 0.4.0 release work. | Keep the change narrow: reduce task-scoped CI gate broad scans and remove legacy sidecar assumptions from release-line fixtures. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Inspect release-line CI gate and closeout fixture paths for lingering current-surface legacy assumptions. | Done | Source audit and `ev:T-0476:b933bd234c7146ae83cbb1a1`. |
| 2 | Route explicit `ci gate --task` selection through exact task lookup and update fixtures to current capsule files. | Done | `ev:T-0476:82360c5c03b346218210b7ba`. |
| 3 | Validate focused tests, build/dist refresh, and built CLI task-scoped smoke. | Done | `ev:T-0476:82360c5c03b346218210b7ba`, `ev:T-0476:cfad6c731d0c461aa6f077d8`, `ev:T-0476:6fe19cde6d3d4b00912d993a`, `ev:T-0476:719663c6debc4b11b269c3f5`. |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Explicit task-scoped CI gate lookup no longer lists every task capsule before selecting the requested task. | Yes | Met | `ev:T-0476:82360c5c03b346218210b7ba` | Required | src/services/ci-gate.ts |
| AC-2 | CI gate release-line fixtures prove current 0.4 capsule docs are enough and do not create removed legacy sidecars. | Yes | Met | `ev:T-0476:82360c5c03b346218210b7ba` | Required | tests/unit/ci-gate.test.ts |
| AC-3 | Release closeout fixture expectations stay aligned with current 9-surface closeout behavior. | Yes | Met | `ev:T-0476:82360c5c03b346218210b7ba` | Required | tests/unit/release-closeout.test.ts |
| AC-4 | Build, dist refresh, and built CLI smoke pass without release or publish mutation. | Yes | Met | `ev:T-0476:6fe19cde6d3d4b00912d993a`, `ev:T-0476:719663c6debc4b11b269c3f5` | Required | dist/cli/main.js |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused CI/release tests | docker exec hadara-dev bash -lc 'cp /workspace/src/services/ci-gate.ts /tmp/hadara-t0447/src/services/ci-gate.ts && cp /workspace/tests/unit/ci-gate.test.ts /tmp/hadara-t0447/tests/unit/ci-gate.test.ts && cp /workspace/tests/unit/release-closeout.test.ts /tmp/hadara-t0447/tests/unit/release-closeout.test.ts && cd /tmp/hadara-t0447 && npx vitest run tests/unit/ci-gate.test.ts tests/unit/release-closeout.test.ts' | Yes | Passed | `ev:T-0476:82360c5c03b346218210b7ba`, `ev:T-0476:cfad6c731d0c461aa6f077d8` |
| Docker build and dist refresh | docker exec hadara-dev bash -lc 'rm -rf /tmp/hadara-t0447/src && cp -a /workspace/src /tmp/hadara-t0447/src && cd /tmp/hadara-t0447 && npm run build && cp -a /tmp/hadara-t0447/dist/. /workspace/dist/' | Yes | Passed | `ev:T-0476:6fe19cde6d3d4b00912d993a` |
| Built CLI task-scoped CI gate smoke | node dist/cli/main.js ci gate --mode advisory --task T-0476 --json | Yes | Passed | `ev:T-0476:719663c6debc4b11b269c3f5` |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/ci-gate.ts | function:selectTasks | Use `findTaskCapsule` for explicit `--task` selection before falling back to broad Done-task listing only for all-task mode. | Task-scoped release/CI checks should avoid broad capsule scans when the caller already provided an exact task id. | `ev:T-0476:82360c5c03b346218210b7ba`, `ev:T-0476:719663c6debc4b11b269c3f5` |
| tests/unit/ci-gate.test.ts | test fixture | Current done-task fixture now uses embedded `TASK.md` sections plus `HANDOFF.md` and asserts removed legacy sidecars are absent. | Prevent release-line tests from silently depending on deleted current-surface sidecar defaults. | `ev:T-0476:82360c5c03b346218210b7ba` |
| tests/unit/release-closeout.test.ts | test fixture | Keep expected release closeout surface count at the current 9-file model. | Preserve T-0472/T-0475 current capsule closeout behavior in final preflight validation. | `ev:T-0476:82360c5c03b346218210b7ba` |
| tasks/T-0475-compatibility-only-legacy-sidecar-cleanup/TASK.md, tasks/T-0475-compatibility-only-legacy-sidecar-cleanup/HANDOFF.md, docs/AGENT_HANDOFF.md, docs/TASK_BOARD.md | docs:carry-forward | Carry forward close-audit evidence id cleanup left after the previous capsule close. | Keep shared state and previous capsule prose aligned with the final T-0475 evidence baseline before closing this preflight batch. | T-0475 close audit evidence. |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `ci gate` still computes global state consistency even for explicit task-scoped advisory smokes, which cost about 12s on the mounted workspace. | Open | Future projection-store or state-consistency performance capsule. |
| RF-2 | Follow-up | Actual 0.4.0 release readiness, package smoke, publish dry-run, npm publish, and recycle work remain outside this three-capsule preflight batch. | Open | Separate release-line capsule. |
