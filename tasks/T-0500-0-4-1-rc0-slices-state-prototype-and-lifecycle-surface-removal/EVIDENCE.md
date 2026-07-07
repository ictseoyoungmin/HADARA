# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0500:ef6aa0705a59470099f4de99 | passed | validation | Docker ext4 full suite passed 1033/1033 after slices-state prototype (FD-012: slices.json, slice add/set/list/render/migrate, doctor drift check, task-next state-first read) and lifecycle surface removal (FD-013: finish/ready/close/audit-close/complete/lifecycle -> hadara.commandRemoved.v1 stubs), including 10 new slices-state tests and 4 removed-lifecycle tests. |
| ev:T-0500:b49ef2fac40b43f080c96671 | passed | validation | Docker ext4 TypeScript build passed with services/slices-state.ts, cli/slice.ts, cli/removed-lifecycle.ts, and the six six-command dispatcher stub wired into cli/task.ts. |
| ev:T-0500:250d41efcb9d42c19b6dce6c | passed | validation | Built-CLI dogfood smoke (disposable /tmp project): slice add bootstraps state rev 1/2 and renders a marked docs/DEVELOPMENT_SLICES.md; hand-editing the projection is detected as drift by doctor and by slice set (state written, projection left untouched); explicit slice render discards the hand edit and clears drift; task next reads recommendations from slices state. Removed-lifecycle stub smoke: task finish/ready/close/audit-close/complete/lifecycle all return hadara.commandRemoved.v1 with exit code 6 and a correct replacementCommand (finalize --execute --auto, finalize, or status). |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0500:5627bf4c24bf4b46a9fb7b7c |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0500:525c1b2552ce4726af350b63 | blocked | hadara slice migrate --json dry-run against HADARA-devs own docs/DEVELOPMENT_SLICES.md (414 historical rows) was inspected read-only (no writes): the parser derives slice id from the Slice cell first token before a colon/pipe, which assumes the new id: title convention; this legacy file predates that convention (plain titles like Harness validate JSON), so derived ids collide (e.g. two rows both yield id Harness). Migrating this specific real file was therefore intentionally NOT executed in this capsule -- AC-2 round-trip losslessness is instead proven with a representative synthetic fixture in tests/unit/slices-state.test.ts covering decorated capsule cells, depends, and a stable re-render. Recorded as RF-1 follow-up: migrate needs an id-derivation fallback (e.g. slugify) before non-conforming legacy tables can be safely migrated. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
