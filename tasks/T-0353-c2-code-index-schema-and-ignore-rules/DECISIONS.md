# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Keep T-0353 as schema/read-model foundation only, without a public `code index` command. | Accepted | C2 spec says dedicated commands are candidates and prefers additive graph options later; public surface should wait for extraction and graph integration. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
| D2 | Put code index contracts in `src/context/code-index.ts`. | Accepted | C1 context routing types already live under `src/context`, and C2 is an additive context-routing layer. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
| D3 | Treat ignore/discovery as deterministic read-only helpers with no cache write. | Accepted | C2 ignore rules specify future local cache path but this capsule does not need cache persistence. | `ev:T-0353:b72d5284ef1d42afa39232a0` |
