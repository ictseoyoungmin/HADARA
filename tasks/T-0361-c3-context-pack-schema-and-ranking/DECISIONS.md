# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep T-0361 internal to schema/runtime registration and graph-report ranking, without adding public `context pack` CLI. | Accepted | This follows the C1-C2 capsule pattern and avoids freezing CLI UX before the C3 report contract is stable. | `src/context/context-pack.ts`, `docs/AGENT_HANDOFF.md`. |
| D-2 | Accept injected `graphReport` and `cache` inputs in the context pack builder. | Accepted | C6 warm-cache/source-manifest work can feed the ranking layer without forcing independent rescans or hidden writes. | `tests/unit/context-pack.test.ts`, `ev:T-0361:dc44300239e5445fbc519132`. |
| D-3 | Emit slice candidates only as metadata and defer actual raw slicing to C4. | Accepted | Context pack can guide future C4 commands without claiming line slicing is implemented in this capsule. | `src/context/context-pack.ts`, `src/schemas/context-pack.schema.json`. |
