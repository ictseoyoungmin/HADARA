# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Normalize finish-generated text documents at the shared content-generation boundary. | Accepted | This reuses the same path for dry-run after-hash planning and execute writes. | `nextWriteContent()` change. |
| D-2 | Keep scope to future finish writes, not historical file cleanup. | Accepted | The problem is workflow recurrence, not committed historical content. | Hotfix scope. |
