# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0174 Phase 3 text output changes. |
| Current Phase | Phase 3 / Task Operator Console | T-0170 close/audit preflight is complete; T-0171 starts the read-only workbench projection. |
| Latest Completed Task | T-0174 Worker-Friendly Text Output | Added grouped non-JSON output for `task status` and `task audit-close`. |
| Active / Next Task | T-0175 Dashboard TUI MCP Read Projection Prep | Prepare future read-only consumers to use the workbench projection without raw file parsing. |
| Validation Baseline | Full Docker check, built CLI text smokes, done harness, and close audit passed | Focused text-output tests passed with 2 files / 8 tests; full Docker `npm run check` passed with 68 files / 491 tests; built CLI status/audit text smokes printed expected sections; T-0174 done harness and audit-close passed. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0172 Workbench Suggested Action Engine | Added centralized next-action builder for workbench status reports. | T-0172 evidence: focused Docker tests, full Docker check, built CLI smoke, done harness, close execute, and audit-close passed. |
| T-0173 Workbench Schema Contract | Registered `hadara.task.workbench.v1` fixture schema and raw report validation coverage. | T-0173 evidence: focused Docker tests, full Docker check, built CLI smoke, done harness, close execute, and audit-close passed. |
| T-0174 Worker-Friendly Text Output | Added concise grouped text output for status and audit-close. | T-0174 evidence: focused Docker tests, full Docker check, built CLI status/audit text smokes, done harness, close execute, and audit-close passed. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Dashboard/TUI/MCP workbench projection prep is not yet done. | Future read consumers still need explicit guidance to use the workbench report rather than raw file parsing. | Complete T-0175 without adding write surfaces. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Continue with T-0175 Dashboard TUI MCP Read Projection Prep. | Status JSON, suggested actions, schema, and text output are implemented; future read consumers need a documented projection boundary. | Use Phase 3 plan, `docs/DASHBOARD_READ_MODEL_CONTRACT.md`, and TUI/MCP read-model docs. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused text-output check | Docker `npx vitest run tests/unit/task-workbench.test.ts tests/unit/task-close.test.ts` passed with 2 files and 8 tests. | Covers status and audit-close text sections. |
| Built CLI smoke | Built CLI `task status --task T-0174` and `task audit-close --task T-0174` printed expected grouped sections. | `/workspace/dist` was refreshed from Docker build output. |
| Full repository check | Docker temp-copy `npm run check` passed with 68 files and 491 tests. | Host dependencies are unavailable; Docker was used. |
| Done-level harness | Docker built CLI `harness validate --task T-0174 --level done --json --project /workspace` returned `ok:true`. | No issues. |
| Close audit | Built CLI `task audit-close --task T-0174 --json` returned `ok:true` with close evidence records and zero warnings. | Final close evidence appended after capsule source docs were updated. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
