# Decisions

Record task-local design decisions here.

- Private raw artifact bytes are copied only to the ignored private portable store under `.hadara/local/portable/data/private-evidence`.
- Committed Task Capsule files keep only sanitized evidence metadata and never store source paths, private store paths, or raw private content.
- If a private evidence source path is not readable, existing private evidence collection remains successful and no raw artifact copy is attempted.
- Encryption remains deferred but explicit in each private manifest record.
- Private evidence manifest writes use the existing private audit JSONL mechanism with actor `system`.
