# T-0474 Dashboard API aggregate route latency profiling

## Identity

| Field | Value |
|---|---|
| ID | T-0474 |
| Title | Dashboard API aggregate route latency profiling |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/cli/dashboard.ts | implementation-source | approved | implemented | sha256:cc00f80fa4b83a99f4fd18de1a92318e9d4548824df553d2ac7e969782ef363c | Dashboard API route cache sharing and endpoint behavior. |
| src/services/dashboard-bootstrap.ts | implementation-source | approved | implemented | sha256:42fc9be9b3c0ae7b06cdf20250b117561bde75ebebed978fc942a9e824394564 | Bootstrap aggregate input dependency reuse. |
| src/services/dashboard-cache.ts | implementation-source | approved | implemented | sha256:1578091e1dfa3bb21adb8d3a28babc1d61855e1f9bedbfeb0c33605adee1e53f | Dashboard process-cache TTLs for aggregate status/tasks. |
| src/services/dashboard-timeline.ts | implementation-source | approved | implemented | sha256:d0e9bbac5fe2255b2b302d165d910496ae6f2b4c962c40fcd69b9bfe08064987 | Task-scoped timeline evidence lookup. |
| tests/unit/dashboard-static.test.ts | implementation-source | approved | implemented | sha256:12b20d8aa41b42ed21a3cbbf9464f4050844fe1fa8395cfa3ab8c6c4123fa3e9 | Dashboard route regression coverage. |

## Goal

| Goal | Notes |
|---|---|
| Reduce dashboard aggregate route latency that can affect release/clean-checkout validation by removing avoidable repeated broad reads and task-scoped broad task scans. | Initial built-CLI profiling showed `/api/dashboard/bootstrap?selectedTaskId=T-0196&cache=bypass` at 15619ms and `/api/timeline?taskId=T-0195&cache=bypass` at 11497ms on the mounted workspace. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Profile dashboard API route latency on the mounted workspace. | Done | Initial route timing captured in this TASK.md. |
| 2 | Remove the task-scoped timeline broad task scan and share status/tasks process-cache reads across aggregate dashboard routes. | Done | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:814e9786faaa41aabd4b0087`, `ev:T-0474:7878feaa7ef14577b16e08ff` |
| 3 | Validate focused dashboard tests, build/dist refresh, and built CLI route timing. | Done | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:814e9786faaa41aabd4b0087`, `ev:T-0474:7878feaa7ef14577b16e08ff` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Task-scoped `/api/timeline?taskId=...` no longer calls broad `listTaskCapsules()` to locate evidence. | Yes | Met | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:7878feaa7ef14577b16e08ff` | Required | src/services/dashboard-timeline.ts |
| AC-2 | `/api/status`, `/api/tasks`, and `/api/dashboard/bootstrap` can reuse process-cache status/task-list reports without changing response schemas. | Yes | Met | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:7878feaa7ef14577b16e08ff` | Required | src/cli/dashboard.ts |
| AC-3 | Focused dashboard regression tests and built CLI route timing evidence are recorded. | Yes | Met | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:814e9786faaa41aabd4b0087`, `ev:T-0474:7878feaa7ef14577b16e08ff` | Required | tests/unit/dashboard-static.test.ts |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused dashboard tests | docker exec hadara-dev bash -lc 'cd /tmp/hadara && npx vitest run tests/unit/dashboard-static.test.ts tests/unit/task-workbench.test.ts' | Yes | Passed | `ev:T-0474:e0d2c6eb9ca448e9858bacb4` |
| Build and dist refresh | docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build && cp -a /tmp/hadara/dist/. /workspace/dist/' | Yes | Passed | `ev:T-0474:814e9786faaa41aabd4b0087` |
| Built CLI route timing smoke | node -e route timing over `dist/cli/dashboard` | Yes | Passed | `ev:T-0474:7878feaa7ef14577b16e08ff` |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/dashboard-timeline.ts | function:readNormalizedEvidenceRecords | Replaced broad task listing with exact task lookup. | Task-scoped timeline should not pay all-capsule scan cost. | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:7878feaa7ef14577b16e08ff` |
| src/services/dashboard-cache.ts | module:dashboard cache | Added status/tasks TTL keys. | Allow aggregate routes to share hot read models. | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:7878feaa7ef14577b16e08ff` |
| src/services/dashboard-bootstrap.ts | function:createDashboardBootstrapReport | Accepts optional precomputed status/tasks dependencies. | Avoid recomputing status/tasks when API route cache already has them. | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:7878feaa7ef14577b16e08ff` |
| src/cli/dashboard.ts | module:dashboard API routes | Added internal cached status/tasks helpers and wired status/tasks/bootstrap routes to them. | Reduce repeated broad scans during dashboard API and release validation flows. | `ev:T-0474:e0d2c6eb9ca448e9858bacb4`, `ev:T-0474:7878feaa7ef14577b16e08ff` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `/api/status` and `/api/tasks` still perform broad task reads on cold cache; this capsule targets repeated route cost and task-scoped timeline broad scan, not a new projection store. | Open | docs/AGENT_HANDOFF.md |
