# T-0621 0.4.6 rc1 release test fixture contract cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0621 |
| Title | 0.4.6 rc1 release test fixture contract cleanup |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Restore rc.1 release validation by aligning stale tests and Docker helper cleanup with current contracts. | Keep the Task Board fail-closed core contract; update stale fixtures instead of weakening production behavior. |

## Scope

| Boundary | Items |
|---|---|
| In | Test fixtures that create Task Capsules, optional-doc managed-section expectation, Docker sync-build temporary workdir cleanup, focused validation, build, and Docker fast sync-build. |
| Out | Broad host child-process EPERM/capture redesign, full Docker workspace copy performance redesign, release publish mutation. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Classify attached release validation failures. | Done |
| 2 | Update stale tests to use the canonical Task Board frame and current optional-doc behavior. | Done |
| 3 | Harden Docker sync-build cleanup against stale temporary directories. | Done |
| 4 | Validate focused regression tests, build, and Docker fast sync-build. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Test fixtures keep the production Task Board canonical-frame guard intact and create capsules through valid project docs. | Done | `ev:T-0621:c25333474bbc4857a6de79e3` | `tests/helpers/task-board.ts` |
| AC-2 | Optional docs removed from default init do not cause managed-section tests to fail. | Done | `ev:T-0621:c25333474bbc4857a6de79e3` | `tests/unit/managed-sections.test.ts` |
| AC-3 | Docker sync-build no longer fails when stale `/tmp/hadara` contents remain after an interrupted run. | Done | `ev:T-0621:0fdd550213e34a119c6fe5af` | `scripts/dev-docker-sync-build.sh` |
| AC-4 | Validation evidence is recorded, including the remaining host-only full-suite blocker. | Done | `ev:T-0621:58063202033141d3b16a3f90`, `ev:T-0621:f112b8462f9d449a845e2ebf` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npx vitest run tests/unit/status-json.test.ts tests/unit/mcp-tools.test.ts tests/unit/active-run-state.test.ts tests/contract/mcp-bridge-contract.test.ts tests/contract/cli-mcp-service-parity.test.ts tests/contract/hermes-compatibility-fixture.test.ts tests/unit/managed-sections.test.ts --reporter=dot` | Yes | Passed | `ev:T-0621:c25333474bbc4857a6de79e3` |
| `npm run build` | Yes | Passed | `ev:T-0621:58063202033141d3b16a3f90` |
| `npm run dev:docker-sync-build` | Yes | Passed | `ev:T-0621:0fdd550213e34a119c6fe5af` |
| `npx vitest run --reporter=dot` | No | Blocked | `ev:T-0621:f112b8462f9d449a845e2ebf` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/48c76d49-56c8-4d76-82f1-a1e914d7ba64/pasted-text.txt` | reference | active | Release validation log with stale test fixture failures. |
| `src/task/task-capsule.ts` | reference | active | Production Task Board canonical-frame guard must remain fail-closed. |
| `.hadara/state/current.json` | reference | active | Current known problems already track host child-process EPERM and mounted workspace latency. |

## Changes

| Area | Summary |
|---|---|
| Tests | Added a canonical Task Board fixture helper and updated stale MCP/status/active-run test setup to use it before `createTaskCapsule`. |
| Tests | Updated managed-section expectation so optional docs absent from default init are not treated as failures. |
| Dev Docker helper | Switched Docker sync-build to per-run temporary workdirs under the configured temp root, avoiding stale directory cleanup collisions. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Host full vitest remains blocked by known child-process EPERM/empty-stdout capture behavior unrelated to the Task Board fixture failure. | Open | `ev:T-0621:f112b8462f9d449a845e2ebf` |
| RF-2 | Follow-up | Docker full-check workspace copy can still sit silent for minutes on the mounted workspace; progress/timeout diagnostics need a separate performance capsule. | Open | `.hadara/local/feedback/T-0621-host-spawn-and-docker-full-copy-friction.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | Done | Fixed stale release validation fixtures and Docker sync-build cleanup; host full suite residual is recorded separately. |
