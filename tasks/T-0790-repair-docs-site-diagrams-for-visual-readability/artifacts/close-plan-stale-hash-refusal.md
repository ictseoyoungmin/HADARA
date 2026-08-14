# Close Plan Stale-Hash Refusal

The first reviewed execute attempt supplied plan hash `sha256:3d862b39c6ee78c7fa9058a8b05780a40e965e202c0dfb4acd3802bf1d0ad3a0`.

Before mutation, current-source `task close` recomputed the plan as `sha256:9f0d2193540b4a14ebe321bcc8f69537c9150d25293b1be11ee9af0f1a84c02b` and returned `TASK_CLOSE_PLAN_PLAN_HASH_MISMATCH`.

Observed write result:

- executed writes: 0
- close proof appended: false
- terminal: false

The stale-plan guard behaved correctly. The ordinary `task close --json` path is appropriate for the already-authorized close because it performs current internal review and hash rechecking in one transaction.
