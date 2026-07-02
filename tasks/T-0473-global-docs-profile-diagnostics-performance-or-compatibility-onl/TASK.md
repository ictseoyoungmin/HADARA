# T-0473 Global docs/profile diagnostics performance or compatibility-only sidecar cleanup decision

## Identity

| Field | Value |
|---|---|
| ID | T-0473 |
| Title | Global docs/profile diagnostics performance or compatibility-only sidecar cleanup decision |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/services/task-workbench.ts | implementation-source | approved | implemented | sha256:c6df567f8c5fff8cc203fa842f3ba96ed620a7ce897d33151d4818ba4c7b8380 | Selected-task workbench detail defaults and protocol diagnostics projection. |
| src/cli/task.ts | implementation-source | approved | implemented | sha256:2f5ca277ad1b92c4380378e942bfe9435c2f22e189d2d6130b23f071b7117d73 | CLI `task status` fast/full option behavior. |
| src/cli/dashboard.ts | implementation-source | approved | implemented | sha256:d8557e1a67b87509ec859bd6ac8b329bbc2fd97b6df5c39d83a2a98fbe3153fa | Dashboard task-workbench API call site. |
| src/services/dashboard-bootstrap.ts | implementation-source | approved | implemented | sha256:30f796d7f3fc1068d82d7e4af03dd386489074381ae6d96117693c2ae48458b8 | Dashboard selected-task summary call site. |
| src/services/dashboard-timeline.ts | implementation-source | approved | implemented | sha256:47f763a803c8c1d8196ebb37eb3c037d7be908b08612d66937bcc436fd506494 | Dashboard timeline selected-task call site. |
| tests/unit/task-workbench.test.ts | implementation-source | approved | implemented | sha256:894368fead5fbc22e45c93b8a9dae66a5c4216e6c4358aa76c6aac873a9e21f8 | Workbench fast/full regression coverage. |
| tests/unit/dashboard-static.test.ts | implementation-source | approved | implemented | sha256:12b20d8aa41b42ed21a3cbbf9464f4050844fe1fa8395cfa3ab8c6c4123fa3e9 | Dashboard route regression coverage. |

## Goal

| Goal | Notes |
|---|---|
| Reduce default selected-task workbench latency by keeping project-wide docs/profile diagnostics out of default service and dashboard call paths while preserving explicit `--detail full` close-grade diagnostics. | This follows the current 0.4 lifecycle model: frequent loop status should be fast, full diagnostics should be opt-in. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract around default fast workbench behavior and explicit full diagnostics. | Done | This TASK.md |
| 2 | Update workbench/dashboard call paths so default projections do not run global docs/profile diagnostics. | Done | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| 3 | Add or update regression coverage for default fast and explicit full behavior. | Done | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| 4 | Validate, record evidence, and finalize the capsule. | Done | ev:T-0473:4fdec13ad3af42928d1d71d8; ev:T-0473:2dd3fa4b13d04089bf651e34 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `createTaskWorkbenchReport` defaults to fast selected-task projection unless full detail is explicitly requested. | Yes | Met | ev:T-0473:6c0e0c8b66ff402fa51ad313 | Required | src/services/task-workbench.ts |
| AC-2 | Dashboard selected-task workbench call sites use fast projections on hot paths and retain explicit full detail only where requested. | Yes | Met | ev:T-0473:6c0e0c8b66ff402fa51ad313 | Required | src/cli/dashboard.ts |
| AC-3 | Explicit full diagnostics still run docs/profile checks and remain covered by tests. | Yes | Met | ev:T-0473:6c0e0c8b66ff402fa51ad313; ev:T-0473:2dd3fa4b13d04089bf651e34 | Required | tests/unit/task-workbench.test.ts |
| AC-4 | Validation evidence is recorded for focused tests and build/built CLI smoke. | Yes | Met | ev:T-0473:6c0e0c8b66ff402fa51ad313; ev:T-0473:4fdec13ad3af42928d1d71d8; ev:T-0473:2dd3fa4b13d04089bf651e34 | Required | EVIDENCE.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused workbench/dashboard tests | docker exec hadara-dev bash -lc 'cd /tmp/hadara && npx vitest run tests/unit/task-workbench.test.ts tests/unit/dashboard-static.test.ts' | Yes | Passed | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| Build and dist refresh | docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build && cp -a /tmp/hadara/dist/. /workspace/dist/' | Yes | Passed | ev:T-0473:4fdec13ad3af42928d1d71d8 |
| Built CLI status smoke | node dist/cli/main.js task status --task T-0473 --json; node dist/cli/main.js task status --task T-0473 --detail full --json | Yes | Passed | ev:T-0473:2dd3fa4b13d04089bf651e34 |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/task-workbench.ts | module:task workbench | Made fast projection the service default and kept full diagnostics opt-in. | Frequent loop status should avoid global docs/profile diagnostics. | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| src/cli/dashboard.ts | endpoint:/api/task-workbench | Added `detail=full` opt-in and otherwise uses fast workbench projection. | Avoid accidental full diagnostics on dashboard hot path. | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| src/services/dashboard-bootstrap.ts | function:createSelectedTaskSummary | Passed `{ detail: 'fast' }` explicitly. | Keep selected-task bootstrap summary on fast workbench projection. | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| src/services/dashboard-timeline.ts | function:createDashboardTimelineReport | Passed `{ detail: 'fast' }` explicitly. | Keep timeline selected-task event on fast workbench projection. | ev:T-0473:6c0e0c8b66ff402fa51ad313 |
| tests/unit/task-workbench.test.ts | module:task workbench tests | Added default-fast service coverage and retained explicit full diagnostics coverage. | Prevent regression to full diagnostics on default paths. | ev:T-0473:6c0e0c8b66ff402fa51ad313 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Risk | Full diagnostics remain intentionally heavier and should be requested through `--detail full` or finalize, not through hot status/dashboard loops. | Open | AC-3 |
