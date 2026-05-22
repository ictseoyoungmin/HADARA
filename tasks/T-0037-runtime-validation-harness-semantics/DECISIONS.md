# Decisions

| Decision | Rationale |
|---|---|
| Reject duplicate run scaffold files instead of adding `--force`. | This is the smallest safe fix and avoids silently overwriting scenario evidence. |
| Treat any failed fake-shell observation as an agent loop failure. | Deterministic harness evidence should not report success after a failed command observation. |
