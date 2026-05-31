# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0158 remediation hardening changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete; T-0152 through T-0158 are complete. |
| Latest Completed Task | T-0158 Safe Protocol Remediation Hardening | Hardened `protocol remediate` execute writes, Metadata upsert, table-frame guards, and conflict checks. |
| Active / Next Task | T-0159 Protocol Consistency JSON Contract | Next Phase 2 slice should register schema fixtures and contract tests for protocol consistency/remediation reports. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 61 files and 455 tests; built CLI remediation hardening smoke passed after refreshing `/workspace/dist`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0156 Profile Drift Remediation Guide | Added `hadara protocol doctor --scope profile --json`, profile doc-set/metadata/Required Reading drift diagnostics, manual remediation objects, and `summary.profile` declared/detected/target/source separation. | T-0156 evidence: focused protocol/profile tests passed with 2 files / 21 tests after edge-case additions; full Docker check passed with 60 files / 440 tests; built CLI profile/task/docs smokes passed after refreshing `/workspace/dist`. |
| T-0157 Safe Protocol Remediation MVP | Added `hadara protocol remediate --fix ... --json [--execute]` for Task Board row insertion, Decisions table frame insertion, Project State profile row upsert, and missing task `evidence.jsonl` creation. | T-0157 evidence: focused remediation/CLI tests passed with 2 files / 13 tests; full Docker check passed with 61 files / 450 tests; built CLI temp-fixture smoke verified dry-run no-write plus bounded execute writes. |
| T-0158 Safe Protocol Remediation Hardening | Added temp-file/rename remediation writes with rollback-attempt issue reporting, before hash/existence conflict checks, section-bounded Project State Metadata profile upsert, and warning-and-skip guards for malformed Task Board / legacy Decisions tables. | T-0158 evidence: focused remediation/CLI tests passed with 2 files / 18 tests; full Docker check passed with 61 files / 455 tests; built CLI smoke verified Metadata preservation and Task Board/Decisions guards. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| Protocol consistency/remediation schema fixtures are not registered yet. | T-0153 through T-0158 emit stable JSON-like report shapes, but broad schema/contract fixture work remains future scope. | Keep T-0159 focused on schema registration and contract coverage, including T-0158 action hash/existence fields. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | Use `protocol remediate` only when an operator explicitly accepts an allowlisted bounded fix; broad cleanup remains future scope. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Start T-0159 Protocol Consistency JSON Contract. | T-0158 hardened the remediation report/action surface; the next slice should schema-register consistency/remediation reports before further consumers rely on them. | Schema fixtures and contract tests for `hadara.protocol.consistency.v1` and `hadara.protocol.remediation.v1`, including optional action hash/existence fields. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol remediation checks | Docker `npx vitest run tests/unit/protocol-remediation.test.ts tests/unit/protocol-cli.test.ts` passed with 2 files and 18 tests. | Covers dry-run no-write behavior, bounded execute writes, Metadata preservation, malformed table warning guards, conflict checks, atomic write failure reporting, CLI JSON, and unsupported fix rejection. |
| Full repository check | Docker temp-copy `npm run check` passed with 61 files and 455 tests. | Host dependencies were unavailable; Docker was used per SOP and changed files were synced into `/tmp/hadara` before the final check. |
| Built CLI smoke | Refreshed `/workspace/dist` from `/tmp/hadara/dist`; built CLI temp-fixture smoke verified Metadata row preservation plus Task Board and Decisions warning-and-skip guards. | Run through `node /workspace/dist/cli/main.js ... --project <temp>`. |
| Done-level harness | Docker built CLI `harness validate --task T-0158 --level done --json --project /workspace` returned `ok: true`; task/docs protocol doctors also returned `ok: true`. | Docs-scope protocol doctor still reports two known historical warnings. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
