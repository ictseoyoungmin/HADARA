# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement source discovery as a metadata-first manifest before adding cache writes. | Accepted | C6 speed depends on avoiding repeated broad content reads; a portable manifest is the narrow shared primitive needed by graph, code index, and context pack consumers. | `src/context/source-manifest.ts` |
| D-2 | Keep C6.1 internal and read-only with no public CLI/status command. | Accepted | A public cache surface would require persistence semantics, stale reporting, and warm/cold guarantees that belong in C6.2. | Scope in `TASK.md` |
| D-3 | Same-size/same-mtime edits without content hashes may remain unchanged in C6.1 comparison. | Accepted | This is the tradeoff that keeps initial discovery fast; later warm paths can compute and persist content hashes for stronger invalidation. | `tests/unit/context-source-manifest.test.ts` |
