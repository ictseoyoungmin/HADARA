# Final TASK.md and HANDOFF.md Fact Check

## Sources checked

- Current TypeScript CLI source through Node's `tsx` loader
- Fresh standard init plan and execute
- Fresh `task create "Fix retry backoff"`
- Generated `TASK.md`, `HANDOFF.md`, `evidence.jsonl`, `EVIDENCE.md`, and Task Board row
- `hadara schema --json` controlled values
- Authored fixture evidence append
- `task close --dry-run --json`
- Reviewed `task close --execute --plan-hash ... --detail full --json`
- Post-close TASK, HANDOFF, Task Board, and evidence projections

## Verified lifecycle

| Check | Observed result |
|---|---|
| Fresh Identity | TASK and HANDOFF began as `Draft` with matching ID, title, Created, and Updated. |
| Initial Task Board | Row began as `Draft`, target `project`, and Result `-`. |
| Initial evidence | `evidence.jsonl` was zero-byte and `EVIDENCE.md` contained empty Validation Evidence, Close Proof, and residual tables. |
| Complete TASK section inventory | Identity, Goal, Scope, Plan, Acceptance, Validation, Inputs / Constraints, Changes, Risks / Follow-ups, Close Summary, and History matched the public page. |
| Complete HANDOFF section inventory | Identity, Last Completed, Pre-Close Operator Action, Post-Close Continuation, and Carry Forward Warnings matched the public page. |
| Controlled TASK values | `constraint`, `active`, `Met`, `Passed`, `Risk`/`Follow-up`, `Open`/`Mitigated`, and the documented plan/status values are valid current vocabulary. |
| Ready-to-close requirement | Final History row `Done`, pre-close `terminal/no`, and post-close `actionable/yes` passed current-source preflight. |
| Reviewed close | Plan hash matched; guarded writes updated three files; readiness and close evidence were appended; audit returned `closed-valid`. |
| TASK after close | Identity became `Done`, Updated advanced, and authored contract sections remained unchanged. |
| HANDOFF after close | Identity became `Done`; Last Completed, pre-close, post-close, and warning prose remained unchanged. |
| Task Board after close | Status became `Done` and Result received the exact Close Summary. |
| Evidence after close | Readiness evidence appeared under Validation Evidence and close proof appeared under Close Proof. |

## Public documentation correction

- The complete examples now use pre-close `Draft` identities.
- The Inputs / Constraints example uses the valid `constraint` role.
- The final History row is `Done` and its pre-close requirement is explained.
- The page lists all four visible close effects and states which task-owned prose close does not invent or rewrite.
- The content regression fixes these exact values.

## Site validation

- `npm test` in `docs/site`: passed.
- `npm run build` in `docs/site`: passed.
- `git diff --check`: passed.

The only remaining T-0790 action is the explicitly authorized real capsule close.
