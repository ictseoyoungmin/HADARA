# Decisions

## Shared Read Model

Use `src/services/evidence-list.ts` as the single report builder for `hadara.evidence.list.v1` so CLI JSON and read-only MCP return the same payload shape.

## Degraded Reads

Malformed `evidence.jsonl` lines produce warning issues and do not make the report fail when at least the read operation itself succeeds. Missing Task Capsules remain an error because there is no valid task evidence source to read.

## Private Evidence

Private evidence is excluded by default. `includePrivate` includes only existing evidence index metadata and does not read private artifact contents or expose source paths.
