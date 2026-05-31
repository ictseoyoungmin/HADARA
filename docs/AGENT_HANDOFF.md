# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0159 protocol JSON contract changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete; T-0152 through T-0159 are complete. |
| Latest Completed Task | T-0159 Protocol Consistency JSON Contract | Registered protocol consistency/remediation schema fixtures and contract tests. |
| Active / Next Task | TBD | Operator should choose the next capsule; no T-0160 capsule has been pre-created. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 61 files and 455 tests; built CLI protocol doctor/remediation smokes passed after refreshing `/workspace/dist`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0157 Safe Protocol Remediation MVP | Added `hadara protocol remediate --fix ... --json [--execute]` for Task Board row insertion, Decisions table frame insertion, Project State profile row upsert, and missing task `evidence.jsonl` creation. | T-0157 evidence: focused remediation/CLI tests passed with 2 files / 13 tests; full Docker check passed with 61 files / 450 tests; built CLI temp-fixture smoke verified dry-run no-write plus bounded execute writes. |
| T-0158 Safe Protocol Remediation Hardening | Added temp-file/rename remediation writes with rollback-attempt issue reporting, before hash/existence conflict checks, section-bounded Project State Metadata profile upsert, and warning-and-skip guards for malformed Task Board / legacy Decisions tables. | T-0158 evidence: focused remediation/CLI tests passed with 2 files / 18 tests; full Docker check passed with 61 files / 455 tests; built CLI smoke verified Metadata preservation and Task Board/Decisions guards. |
| T-0159 Protocol Consistency JSON Contract | Registered `hadara.protocol.consistency.v1` and `hadara.protocol.remediation.v1` schema fixtures, runtime loader entries, schema docs, and focused service/CLI contract tests including T-0158 action hash/existence fields. | T-0159 evidence: focused schema/protocol tests passed with 4 files / 34 tests; full Docker check passed with 61 files / 455 tests; built CLI task doctor and remediation dry-run smokes passed after refreshing `/workspace/dist`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Protocol schemas are fixture-level, not release-gate strict schemas. | Additive report fields remain allowed; consumers should not treat these schemas as a blocking release gate yet. | Preserve additive compatibility or create a new schema id for breaking changes. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Choose the next capsule. | T-0159 completes the planned Phase 2 JSON contract slice. | No T-0160 capsule is pre-created; use `docs/TASK_BOARD.md` and `docs/DEVELOPMENT_SLICES.md` to select the next work item. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol/schema checks | Docker `npx vitest run tests/unit/schema-fixtures.test.ts tests/unit/protocol-consistency.test.ts tests/unit/protocol-remediation.test.ts tests/unit/protocol-cli.test.ts` passed with 4 files and 34 tests. | Covers schema registry alignment, consistency report validation, remediation report validation, CLI JSON payload validation, and optional action hash/existence fields. |
| Full repository check | Docker temp-copy `npm run check` passed with 61 files and 455 tests. | Host dependencies were unavailable; Docker was used per SOP and changed files were synced into `/tmp/hadara` before the final check. |
| Built CLI smoke | Refreshed `/workspace/dist` from `/tmp/hadara/dist`; built CLI `protocol doctor --task T-0159 --json --project /workspace` returned `ok: true`, and remediation dry-run returned `hadara.protocol.remediation.v1`. | Run through `node /workspace/dist/cli/main.js ... --project /workspace`. |
| Done-level harness | Docker built CLI `harness validate --task T-0159 --level done --json --project /workspace` returned `ok: true`; task protocol doctor returned `ok: true`; docs protocol doctor returned `ok: true`. | Docs-scope protocol doctor still reports two known historical warnings. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
