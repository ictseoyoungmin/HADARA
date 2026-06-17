# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0334 |
| TaskStatus | In Progress |
| Last Updated | 2026-06-17 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0334 rebuild boundary documented | README, CLI JSON contract, task workflow docs, generated init docs, and command registry guidance now state that 0.3.2 has no rebuild preview/execute behavior; `evidence.jsonl` is canonical; `EVIDENCE.md` is a non-canonical human summary; future `wouldChange` semantics require drift classes; future execute must be dry-run-first and before-hash guarded. |
| Validation passed | Docker full sync-build passed 119 files / 791 tests with `distLooksStale:false`; `git diff --check` passed. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0335 Evidence v2 Docs Consolidation. | T-0333/T-0334 doc surfaces are now ready for consolidation and release-prep alignment. | `docs/specs/0.3.2/capsules/T-0335_Evidence_v2_Docs_Consolidation.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Rebuild remains deferred. | Operators should not expect `hadara evidence rebuild` preview or execute behavior in 0.3.2. | Keep T-0335 wording consistent: canonical JSONL, non-canonical Markdown summary, no runtime rebuild command. |
