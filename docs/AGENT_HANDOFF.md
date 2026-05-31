# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0164 protocol surface docs alignment changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete; T-0152 through T-0164 are complete. |
| Latest Completed Task | T-0164 Protocol Surface Docs Alignment | Aligned CLI help, README, JSON contract docs, schema docs, schema index notes, and Phase 2 planning docs with implemented protocol surfaces. |
| Active / Next Task | Operator-selected next work | T-0161 through T-0164 strict-plan Phase 2 hardening follow-ups are complete. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 63 files and 472 tests; `/workspace/dist` was refreshed from Docker build output; built CLI help smoke passed. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0162 Doctor Remediation Hint Unification | Added additive `suggestedFix` hints and safe-auto remediation objects to doctor reports for existing allowlisted fixes while keeping doctor read-only. | T-0162 evidence: focused protocol/remediation tests passed with 3 files / 38 tests; full Docker check passed with 62 files / 467 tests; built CLI docs-scope smoke returned safe-auto hints. |
| T-0163 Task Capsule Upgrade Scaffold Command | Added `hadara task upgrade-scaffold --task <id> --json [--execute]`, safe append/create-only execution, ambiguous-frame skips, and `hadara.task.upgrade_scaffold.v1`. | T-0163 evidence: focused upgrade/schema/task tests passed with 3 files / 11 tests; full Docker check passed with 63 files / 472 tests; built CLI dry-run smoke passed. |
| T-0164 Protocol Surface Docs Alignment | Aligned executable help, README, CLI JSON contract docs, schema notes, schema registry metadata, and Phase 2 follow-up docs with the implemented protocol doctor/remediate/task upgrade surfaces. | T-0164 evidence: full Docker check passed with 63 files / 472 tests; built CLI help smoke listed protocol doctor default/all-scope forms and task upgrade-scaffold; done-level harness returned `ok: true`; `/workspace/dist` was refreshed. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| All-scope protocol doctor is broad but not a deep done-level check for every historical capsule. | It keeps default protocol doctor responsive by aggregating docs, profile, and active-task detail; docs-scope still checks Task Board/capsule drift across all tasks. | Use task-scoped doctor or harness validation for deep capsule checks. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |
| Phase 2 strict-plan hardening follow-ups are complete. | T-0161 through T-0164 close the remaining strict-reading gaps from the Phase 2 plan. | Treat further Phase 2 work as operator-selected maintenance or new product scope, with a new Task Capsule. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Choose the next operator-directed capsule. | Planned Phase 2 product-baseline and strict-plan hardening capsules are complete through T-0164. | Start from `docs/TASK_BOARD.md`, `docs/ROADMAP.md`, and `docs/DEVELOPMENT_SLICES.md` before opening new scope. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol surface docs checks | Built CLI `--help` output lists `hadara task upgrade-scaffold --task <task-id> [--execute] [--json]`, `hadara protocol doctor [--json]`, and `hadara protocol doctor --scope docs\|profile\|all [--json]`. | Verifies executable help matches aligned docs. |
| Full repository check | Docker temp-copy `npm run check` passed with 63 files and 472 tests. | Host dependencies were unavailable; Docker was used per SOP and changed files were synced into `/tmp/hadara` before the final check. |
| Built dist refresh | Refreshed `/workspace/dist` from `/tmp/hadara/dist`. | Required because CLI help text changed. |
| Done-level harness | Docker built CLI `harness validate --task T-0164 --level done --json --project /workspace` returned `ok: true`. | No issues. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
