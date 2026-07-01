# T-0458 Agent UX Task Status Lifecycle Cockpit

## Identity

| Field | Value |
|---|---|
| ID | T-0458 |
| Title | Agent UX Task Status Lifecycle Cockpit |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | approved | implemented | sha256:e373b6578085e8f06dc117458600f525615360e3c397507c2fae00b5ddb4a32d | Defines current task command loop and compatibility boundaries. |
| docs/CLI_JSON_CONTRACT.md | constraint | approved | implemented | sha256:024e4c4fef9f8da30c8f8e2a5eb15c50ccc767929882b31a54a61b3fa20cb8ae | Defines command schema and write-policy expectations. |
| docs/LIFECYCLE_GUIDE.md | reference | approved | implemented | sha256:0f7fd5aaa16e316766157a7a26c3bede7c5ac0b3f707793a8133253e1f936ed1 | Human-readable lifecycle projection from registry concepts. |
| src/services/task-workbench.ts | implementation-source | approved | implemented | sha256:7b261ec4b88e26fb3b5c05e52ef19abf8f0c1d6358fe21c63e8ffd43474cf7d4 | Existing `task status --task` workbench implementation. |
| src/task/task-next.ts | implementation-source | approved | implemented | sha256:f7728c1c2c79a764a0b6dfa745c37e5b56dc38ad29eab50833d93386cc636db3 | Existing next-work recommendation source now embedded by status selection mode. |
| src/task/task-lifecycle.ts | implementation-source | approved | implemented | sha256:85d9640769b3c44f73c1a470b4f5772156f1a55b61fc5e40a666cfc7774618ff | Existing lifecycle report retained as compatibility. |

## Goal

| Goal | Notes |
|---|---|
| Make `hadara task status` the default read-only lifecycle cockpit. | `task status --json` now handles next-work selection, and `task status --task T-XXXX --json` reports loop phase and primary next action. `task next` and `task lifecycle` are documented as planned-removal compatibility commands. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Add status selection mode and loop metadata to selected-capsule status reports. | Done | `ev:T-0458:23de043e969f4cfe821911da` |
| 2 | Reclassify `task next` and `task lifecycle` in registry/help/docs as compatibility commands. | Done | `ev:T-0458:23de043e969f4cfe821911da` |
| 3 | Add concrete 0.4 lifecycle cockpit specs under `docs/specs/0.4.0/lifecycle/`. | Done | `ev:T-0458:904b129902fa47839432ede7` |
| 4 | Validate focused behavior, schema registration, generated init docs, TypeScript build, dist refresh, and built CLI smokes. | Done | `ev:T-0458:23de043e969f4cfe821911da`, `ev:T-0458:43643f1971ac43a2a6a74e6c`, `ev:T-0458:904b129902fa47839432ede7` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `hadara task status --json` works as the no-task next-work selection cockpit. | Yes | Met | `ev:T-0458:23de043e969f4cfe821911da`, `ev:T-0458:904b129902fa47839432ede7` | Required | `src/services/task-workbench.ts`, `src/cli/task.ts` |
| AC-2 | `hadara task status --task T-XXXX --json` exposes loop phase, primary next action, and deprecated command replacements. | Yes | Met | `ev:T-0458:23de043e969f4cfe821911da`, `ev:T-0458:904b129902fa47839432ede7` | Required | `src/schemas/task-workbench.schema.json` |
| AC-3 | `task next` and `task lifecycle` remain callable but are no longer primary/default lifecycle commands. | Yes | Met | `ev:T-0458:23de043e969f4cfe821911da` | Required | `src/services/capability-registry.ts`, `src/services/lifecycle-guide.ts` |
| AC-4 | 0.4 lifecycle status cockpit schema/spec docs are present under `docs/specs/0.4.0/lifecycle/`. | Yes | Met | `ev:T-0458:904b129902fa47839432ede7` | Required | `docs/specs/0.4.0/lifecycle/` |
| AC-5 | Build, focused tests, generated docs tests, schema fixtures, built CLI smokes, and diff check pass. | Yes | Met | `ev:T-0458:23de043e969f4cfe821911da`, `ev:T-0458:43643f1971ac43a2a6a74e6c`, `ev:T-0458:904b129902fa47839432ede7` | Required | Docker validation and built CLI smoke |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused tests | `npx vitest run tests/unit/task-workbench.test.ts tests/unit/lifecycle-guide.test.ts tests/unit/help.test.ts tests/unit/command-registry.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts tests/unit/schema-fixtures.test.ts` in Docker `/tmp/hadara` | Yes | Passed | `ev:T-0458:23de043e969f4cfe821911da` |
| TypeScript build | `npm run build` in Docker `/tmp/hadara` | Yes | Passed | `ev:T-0458:43643f1971ac43a2a6a74e6c` |
| Built CLI smoke and diff check | `node dist/cli/main.js task status --json`, `node dist/cli/main.js task status --task T-0458 --json`, `git diff --check` | Yes | Passed | `ev:T-0458:904b129902fa47839432ede7` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| `src/cli/task.ts` | N/A | Allows `task status` without `--task` and routes to selection report. | Make status the single entry point for next-work selection. | `ev:T-0458:23de043e969f4cfe821911da` |
| `src/services/task-workbench.ts` | N/A | Adds selection report, loop guidance, deprecated command replacements, and authoring primary action. | Merge next/lifecycle guidance into status. | `ev:T-0458:23de043e969f4cfe821911da` |
| `src/services/workbench-next-actions.ts` | N/A | Recommends finalize dry-run/execute instead of low-level close and supports continue actions. | Keep default loop finalize-first. | `ev:T-0458:23de043e969f4cfe821911da` |
| `src/services/capability-registry.ts`, `src/services/lifecycle-guide.ts`, `src/cli/help.ts` | N/A | Reclassifies `task next` and `task lifecycle` as compatibility and updates primary help path. | Remove deprecated commands from default agent loop. | `ev:T-0458:23de043e969f4cfe821911da` |
| `src/schemas/task-status.schema.json`, `src/schemas/task-workbench.schema.json`, `src/schemas/schema-index.json`, `src/core/schema.ts` | N/A | Registers selection schema and additive workbench loop fields. | Make JSON consumers see stable status cockpit contracts. | `ev:T-0458:23de043e969f4cfe821911da` |
| `src/services/dashboard-task-detail.ts` | N/A | Adds loop metadata to fast dashboard workbench projection. | Keep shared `TaskWorkbenchReport` type complete. | `ev:T-0458:43643f1971ac43a2a6a74e6c` |
| `docs/*`, `README.md`, `AGENTS.md`, `src/cli/init.ts` | N/A | Updates current workflow docs and generated init guidance to status-first. | Prevent agents from learning the old split loop. | `ev:T-0458:23de043e969f4cfe821911da` |
| `docs/specs/0.4.0/lifecycle/` | N/A | Adds cockpit, schema, and deprecation plan specs. | Record the concrete 0.4 lifecycle design. | `ev:T-0458:904b129902fa47839432ede7` |
| `dist/` | N/A | Refreshed built CLI output from Docker build. | Keep workspace built CLI current. | `ev:T-0458:43643f1971ac43a2a6a74e6c` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | `session start` still has historical guidance that can prioritize `task lifecycle`/`task next`; align it with status cockpit in a later capsule. | Open | `src/context/session-start.ts`, `tests/unit/session-start.test.ts` |
| RF-2 | Follow-up | `task next` and `task lifecycle` are deprecated but not removed; schedule removal only after release notes and dogfood prove status-first flow. | Open | `docs/specs/0.4.0/lifecycle/02_Command_Deprecation_Plan.md` |
| RF-3 | Risk | `task status` remains slow on mounted workspaces because it still composes broad protocol/readiness sources; this capsule changes guidance semantics, not latency. | Accepted | `docs/AGENT_HANDOFF.md`, `.hadara/context/MEMORY.md` |
