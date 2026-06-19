# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Move context-slice path normalization and denylist/allowlist checks into `src/context/context-slice-boundary.ts`. | Accepted | A shared helper prevents context slice and context pack from drifting. | `ev:T-0387:561d66c217184e529964d5ee` |
| D-2 | Filter context-pack slice candidates with the same predicate used by raw `context slice`. | Accepted | Pack output should not publish suggested commands for generated/local/private paths. | `ev:T-0387:561d66c217184e529964d5ee` |
| D-3 | Preserve the existing `.hadara` public-context allowlist. | Accepted | `.hadara/context/HADARA_CONTEXT.md` and `.hadara/docs-registry.json` remain intentional project-local public context surfaces. | `ev:T-0387:561d66c217184e529964d5ee` |
