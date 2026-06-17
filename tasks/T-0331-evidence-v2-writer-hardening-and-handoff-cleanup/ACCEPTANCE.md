# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `--result failed --outcome passed` fails with `EVIDENCE_RESULT_OUTCOME_MISMATCH`. | Done | Focused CLI test and built CLI smoke `ev:T-0331:60b1b72df6a94af2b4746457`. |
| AC-2 | `--outcome recorded` keeps legacy result `unknown` when `--result` is omitted, and rejects incompatible explicit results such as `--result passed`. | Done | Focused CLI tests passed. |
| AC-3 | Failed, blocked, unknown, or not-applicable later evidence with `resolves:<id>` does not resolve earlier failed evidence. | Done | Focused semantic/lint tests passed. |
| AC-4 | Only passed or recorded later evidence with `resolves:<id>` or `supersedes:<id>` counts as exact resolution. | Done | Focused semantic tests passed. |
| AC-5 | Evidence writer ignores task-like directories without `TASK.md`. | Done | Focused task-capsule writer test passed. |
| AC-6 | Evidence writer returns an ambiguous task error when more than one same-id directory has `TASK.md`. | Done | Focused JSON/writer tests passed. |
| AC-7 | T-0330 HANDOFF.md no longer says finish/ready/close/audit is the next step. | Done | T-0330 HANDOFF points to T-0331 hardening follow-up. |
| AC-8 | Docker focused tests and full check pass. | Done | `ev:T-0331:5bd88716f7b6474c8ecddf6e`, `ev:T-0331:dd02bcba405c498d99331dd8`. |
