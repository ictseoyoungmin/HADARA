# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use additive evidence v2 metadata instead of a new evidence schema version. | Accepted | Tags, idempotencyKey, and actor metadata solve this slice without breaking mixed v1/v2 readers. | Evidence writer tests. |
| D-2 | Same task/source/report close execute is a no-op. | Accepted | This directly prevents uncontrolled duplicate close evidence while preserving dry-run review and readiness checks. | Task-close duplicate test. |
| D-3 | Changed source/report close proof supersedes the latest non-superseded proof when it has a v2 id. | Accepted | Operators need a clear current close proof after source drift; historical id-less records remain compatibility-read. | Supersedes test and built smoke. |
| D-4 | Keep close source-hash inputs unchanged. | Accepted | Redesigning close hash inputs is larger than the idempotency/supersedes slice. | Risk record and audit smoke. |
