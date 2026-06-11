# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `src/services/capability-registry.ts` instead of the stale spec path `src/cli/command-registry.ts`. | Accepted | T-0291 made the service file authoritative and tests guard against a second registry. | `docs/COMMAND_SURFACE.md`, T-0291 |
