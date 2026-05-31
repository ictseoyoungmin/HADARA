# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0175 read projection prep changes. |
| Current Phase | Phase 3 / Task Operator Console | T-0170 close/audit preflight is complete; T-0171 starts the read-only workbench projection. |
| Latest Completed Task | T-0175 Dashboard TUI MCP Read Projection Prep | Added workbench read-model consumer contract and future dashboard/MCP read-only guidance. |
| Active / Next Task | T-0176 Evidence From Command Design | Design shell-executing evidence capture as a deferred/high-risk surface without implementing execution. |
| Validation Baseline | Full Docker check, built CLI smoke, done harness, and close audit passed | Full Docker `npm run check` passed with 68 files / 491 tests; built CLI `task status --task T-0175 --json` returned `hadara.task.workbench.v1`; T-0175 done harness and audit-close passed. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0173 Workbench Schema Contract | Registered `hadara.task.workbench.v1` fixture schema and raw report validation coverage. | T-0173 evidence: focused Docker tests, full Docker check, built CLI smoke, done harness, close execute, and audit-close passed. |
| T-0174 Worker-Friendly Text Output | Added concise grouped text output for status and audit-close. | T-0174 evidence: focused Docker tests, full Docker check, built CLI status/audit text smokes, done harness, close execute, and audit-close passed. |
| T-0175 Dashboard TUI MCP Read Projection Prep | Added workbench read-model contract and future read-consumer guidance. | T-0175 evidence: full Docker check, built CLI workbench smoke, done harness, close execute, and audit-close passed. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Evidence from-command remains design-only. | Shell-executing evidence capture is high-risk and not implemented. | Complete T-0176 as a design/dry-run boundary only. |
| Close validation evidence can create a fixed-point loop if modeled as a same-run precondition. | Recording validation evidence mutates evidence files after validation. | Use the documented three-layer model: validation proves readiness, close records the proof, audit checks the close record. T-0170 adds source/report hash split and read-only audit for this model. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Continue with T-0176 Evidence From Command Design. | Phase 3 workbench/read projection slices are complete; remaining planned item is a safe design boundary for future shell evidence capture. | Use Phase 3 plan, `docs/SECURITY_MODEL.md`, and evidence/redaction docs. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Built CLI smoke | Built CLI `task status --task T-0175 --json` returned `hadara.task.workbench.v1`. | `/workspace/dist` was refreshed from Docker build output. |
| Full repository check | Docker temp-copy `npm run check` passed with 68 files and 491 tests. | Host dependencies are unavailable; Docker was used. |
| Done-level harness | Docker built CLI `harness validate --task T-0175 --level done --json --project /workspace` returned `ok:true`. | No issues. |
| Close audit | Built CLI `task audit-close --task T-0175 --json` returned `ok:true` with close evidence records and zero warnings. | Final close evidence appended after capsule source docs were updated. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
