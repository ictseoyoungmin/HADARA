# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use a local npm install inside an isolated toy project instead of the workspace build. | Accepted | This validates the consumer package path and avoids conflating installed behavior with `/workspace/dist`. | npm install/version checks. |
| D-2 | Exercise publish/release commands only in dry-run/read-only mode. | Accepted | Release mutation remains approval-gated under T-0269. | Command matrix. |
