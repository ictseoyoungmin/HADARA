# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `--sync-dist` fails closed without reviewed hash metadata. | Done | Built CLI no-hash smoke returned `HADARA_DIST_SYNC_BEFORE_HASH_REQUIRED`, `conflictDetected:true`, and `outputMutation:false`. |
| AC-2 | Matching `--before-hash` allows dist sync and stale hash blocks it. | Done | Unit tests cover matching and stale hashes; built CLI matching-hash smoke executed dist sync with `beforeHashMatched:true`. |
| AC-3 | Missing pre-sync hash requires explicit `--allow-missing-before-hash`. | Done | Unit test covers first-time missing-hash escape-hatch behavior. |
| AC-4 | Template expected evidence is recorded. | Done | Focused Docker wrapper, Docker sync-build, and built CLI smokes recorded as `ev:T-0263:efa91bc2ed66421495853082`. |
| AC-5 | Evidence is attached and handoff is updated. | Done | Evidence attached, handoff updated, and close/audit passed. |
