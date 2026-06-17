# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0332-01 | Put result/outcome compatibility validation at `appendEvidenceRecord()` rather than only in CLI parsing. | Accepted | This is the last shared boundary before artifact copy, Markdown append, and JSONL append, so direct writer callers fail closed. | User review feedback; code inspection |
| D-0332-02 | Keep evidence rebuild as deferred Work Item B scope. | Accepted | The current request targets writer stabilization and implementation review; Work Item B marks rebuild as a future candidate, not required initial scope. | Work Item B non-goals/development plan |
| D-0332-03 | Preserve the existing `hadara.evidence.collect.v1` JSON report envelope for compatibility. | Accepted | Work Item B's `hadara.evidence.addCommand.v2` report shape is candidate documentation; changing the public schema id is broader API work and not required for the writer guard. | CLI JSON contract compatibility |
