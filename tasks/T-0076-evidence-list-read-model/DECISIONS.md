# Decisions

## Shared Read Model

Use `src/services/evidence-list.ts` as the single report builder for `hadara.evidence.list.v1` so CLI JSON and read-only MCP return the same payload shape.

## Degraded Reads

Malformed `evidence.jsonl` lines produce warning issues and do not make the report fail when at least the read operation itself succeeds. Missing Task Capsules remain an error because there is no valid task evidence source to read.

Records whose internal `taskId` does not match the requested Task Capsule are treated as degraded evidence index drift: the record is dropped and an `EVIDENCE_RECORD_TASK_MISMATCH` warning is returned.

## Private Evidence

Private evidence is excluded by default. `includePrivate` includes only existing evidence index metadata and does not read private artifact contents or expose source paths.

The read model normalizes parsed JSONL records before returning them. Unknown fields are dropped, summaries are redacted defensively at read time, and private records never expose `evidencePath` even if a drifted index line contains one.
