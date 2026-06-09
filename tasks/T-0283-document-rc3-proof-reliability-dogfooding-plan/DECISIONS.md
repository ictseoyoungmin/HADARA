# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat evidence writer hardening as P0 before proof MVP. | Accepted | Proof status depends on reliable, idempotent evidence records; the dogfooding bug directly affects proof trust. | `docs/specs/rc3-proof-reliability/01_Evidence_Append_Idempotency_and_Locking.md` |
| D-2 | Defer `session start` from rc3. | Accepted | Resume-cost was not measured from transcripts, while proof/auditability value was observed directly. | `docs/specs/rc3-proof-reliability/00_RC3_Proof_Reliability_Index.md` |
