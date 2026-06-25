# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `/api/debt` as a dashboard route but back it with the fast dashboard debt projection. | Accepted | The dashboard needs a legacy-compatible read route, but a route handler must not perform a broad operational-debt scan during release/full-suite validation. | `ev:T-0421:98e0dd670b3c489484bdebfb` |
| D-2 | Leave full operational-debt diagnostics outside dashboard API hot paths. | Accepted | Deep debt inspection remains valuable, but it belongs to explicit CLI/MCP diagnostic commands rather than automatic dashboard route tests. | `src/cli/dashboard.ts` |
| D-3 | Do not create a new release capsule for the publish retry. | Accepted | The helper correctly requires T-0418 as the `hadara@0.3.4-rc.0` release capsule; T-0421 is only a source hotfix. | T-0418/T-0421 workflow |
