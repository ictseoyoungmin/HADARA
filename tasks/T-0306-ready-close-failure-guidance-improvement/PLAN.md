# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and rc2 T-0306 spec. | Done | Required docs and T-0306 spec read. |
| 2 | Resolve focused test files with repository search. | Done | `rg --files tests | rg 'task-ready|harness|task-close|schema'`. |
| 3 | Add additive remediation hint fields to harness issues and propagate through ready/close. | Done | Harness issues include `heading`, `fixHint`, `example`, and `remediationHint`; close/ready expose them. |
| 4 | Update JSON schemas/fixtures and focused tests. | Done | Added harness schema fixture and updated ready/close schemas/tests. |
| 5 | Run focused validation, build/dist refresh, smoke, and diff check. | Done | Evidence `ev:T-0306:79d346d1f54c4d6d8f3667c3`. |
| 6 | Attach evidence, finish, update shared docs, ready, close, audit, and commit. | In Progress | Evidence attached; finish/close workflow pending. |
