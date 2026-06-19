# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement `--symbol` as C2-indexed bounded neighborhood slicing. | Accepted | C2 exposes declaration line reliably; exact body end ranges are not always present yet. | `src/context/code-index.ts`, C4 spec |
| D-2 | Implement `--task --candidate` by resolving a fresh C3 context pack candidate and delegating to existing slice strategies. | Accepted | Candidate ids are emitted by C3, so C4 should not duplicate ranking logic or perform broad candidate discovery. | `src/context/context-pack.ts`, C3 spec |
| D-3 | Keep context slice read-only and avoid implicit cache warm writes. | Accepted | C6 makes cache explicit and rebuildable; C4 should not mutate cache or evidence. | C6 spec |
