# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `.hadara/docs-registry.json` as the source of truth for Document nodes. | Accepted | The docs registry already carries canonical path, title, tier, status, supersession, and command references needed for context routing. | `src/context/registry-extractors.ts`; `ev:T-0346:013ad0cd2fd843ccb006d900` |
| D-2 | Use the runtime command registry API for Command nodes and opportunistically hash `src/services/capability-registry.ts` when present. | Accepted | Runtime metadata is the authoritative command inventory, while the source hash preserves source addressability in source checkouts. | `src/context/registry-extractors.ts`; `ev:T-0346:013ad0cd2fd843ccb006d900` |
| D-3 | Do not add a command-registry StateSource kind in this capsule. | Accepted | The current context graph schema has no command-registry state-source kind; adding one is schema scope and not required for Command nodes/doc edges. | `src/context/context-graph.ts`; `src/context/registry-extractors.ts` |
