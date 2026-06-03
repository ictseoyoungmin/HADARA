# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0234 |
| Status | Done |
| Last Updated | 2026-06-03 |

## Last Completed

| Item | Evidence |
|---|---|
| Release/smoke custom evidence writers are removed from the v1 path. | Package smoke, clean-checkout smoke, and release artifact attach helpers now call the canonical v2 text artifact writer. |
| Release readiness reads v2. | `readReleaseEvidenceRecords()` accepts v1/v2 records and strict release proof accepts valid v2 release evidence. |
| Validation passed. | Focused release/evidence suite passed 7 files / 73 tests; Docker sync-build passed 91 files / 600 tests. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start Evidence v2 migration preview. | Canonical writes and release/smoke compatibility are now aligned; historical v1 records remain unmigrated. | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md`, T-0233/T-0234 handoffs. |
| Keep `EVIDENCE.md` frame redesign separate. | Human table ids remain deferred and should not be bundled into migration preview unless explicitly scoped. | T-0234 RISKS. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Existing historical release evidence is still v1. | Strict gates remain compatible, but old records do not gain durable ids. | Migration preview should be dry-run-first and hash-guarded. |
| Direct custom evidence writers may exist outside release/smoke paths. | Future features could accidentally bypass v2. | Search for direct `fs.appendFileSync(... evidence.jsonl ...)` before adding new writer surfaces. |
