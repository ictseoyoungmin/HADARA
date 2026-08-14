# Fresh task-create content reconciliation

## Runtime exercise

The current rebuilt `dist` CLI initialized a disposable standard project and created `T-0001 Inspect generated capsule anatomy`. The public Task Capsules page was reconciled against the bytes generated immediately after `task create`, before any task authoring or evidence append.

## Literal generated state

| Surface | Observed initial state |
|---|---|
| `TASK.md` | Identity; Goal; Scope; Plan; Acceptance; Validation; Inputs / Constraints; Changes; Risks / Follow-ups; blank Close Summary; History. |
| `HANDOFF.md` | Identity; Last Completed; Pre-Close Operator Action; Post-Close Continuation; Carry Forward Warnings. Continuation tables have Step, Disposition, Create Task, Reason, and Required Reading columns. |
| `EVIDENCE.md` | Empty managed tables for Validation Evidence, Close Proof, and Failed / Blocked / Residual Evidence. |
| `evidence.jsonl` | Present and zero-byte. |
| Task Board | Draft row with `Targets=project`, capsule path, and `Result=-`. |

## Public correction

The page now separates literal fresh output from authored abbreviated examples. It enumerates every generated section, preserves actual Acceptance/Validation/HANDOFF table columns in examples, includes command-owned Identity in the section references, explains the blank initial Close Summary and Task Board row, and records the initial evidence-file state.

## Validation

| Check | Result |
|---|---|
| Docs content contract | Passed with assertions for the exact section names, table headers, zero-byte evidence log, and initial Task Board row. |
| TypeScript and Vite production build | Passed. |
| 1920px by 6000px headless Edge render | Passed without observed text or table overflow in the changed Task Capsules content. |
| Human visual approval | Still pending and not replaced by this agent inspection. |

