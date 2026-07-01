# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `task status --json` now includes `sources.evidenceList.validationAttempts` with per-check latest status, unresolved failed/blocked counts, and resolution evidence ids. | `ev:T-0455:d4b3ea9ddcc549fda9eaeeb5` |
| The projection handles both passing same-check retries and later explicit `resolves:<id>` evidence for blocked attempts. | `ev:T-0455:ec70182bf0f9491292013cf1` |
| Text `task status` now shows compact validation check count and unresolved count when validation attempts exist. | `ev:T-0455:ec70182bf0f9491292013cf1` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open the next agent UX capsule for wrapper/help mutation hazards. | T-0454 exposed `validation run` nested spawn EPERM handling and `evidence add-command --help` recording default evidence; T-0455 solved latest-attempt visibility but did not fix those command UX hazards. | `tasks/T-0454-agent-ux-validation-attempt-auto-resolution/HANDOFF.md`, `src/services/validation-run.ts`, `src/cli/evidence.ts`, `tests/unit/validation-run.test.ts`, `tests/unit/evidence-json.test.ts` |
| Keep status latency on the follow-up list. | `task status` became more informative, but mounted-workspace status reads still took tens of seconds while composing broad reports. | `src/services/task-workbench.ts`, `src/services/protocol-consistency.ts`, `src/task/task-close.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `validationAttempts` is additive under `sources.evidenceList`. | Existing consumers should keep working, but new consumers should treat this as a compact read model rather than parsing raw `evidence.jsonl`. | Prefer `task status --json` for current validation state. |
| Explicit resolution evidence without a validation-check tag can resolve a grouped attempt, but it is not itself counted as a validation attempt. | This keeps the projection focused on attempts while still honoring repair evidence. | Use `resolutionEvidenceIds` to see the repair proof. |
