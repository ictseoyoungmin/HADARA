# Acceptance Criteria

- [x] Package-smoke local execution can attach a reduced public summary when `--attach-evidence --task <task-id>` is provided.
- [x] Clean-checkout smoke execution can attach a reduced public summary when `--attach-evidence --task <task-id>` is provided.
- [x] Attached public artifacts live under smoke-specific Task Capsule artifact directories and are referenced by `evidence.jsonl`.
- [x] Public summaries pass redaction policy and exclude raw logs, raw package contents, private paths, private store paths, release mutation, and publish mutation.
- [x] Default smoke behavior remains unchanged: no evidence attachment without `--attach-evidence`, no release-gate execution, and no MCP smoke execution surface.
- [x] Docker focused tests, full check, built CLI attach-evidence smoke, strict release gate, and done-level harness validation are recorded.
