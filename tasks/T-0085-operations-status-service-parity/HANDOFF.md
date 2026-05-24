# Handoff

## Last Completed

- Added `src/services/operations-status-service.ts` with `createOpsStatusReport()` and `formatOpsStatusReport()` for `hadara.ops.status.v1`.
- Routed CLI `hadara status` and `hadara ops status` through the shared operations status service.
- Kept `src/cli/status-json.ts` as a compatibility export for existing imports.
- Updated focused status tests to import the shared service boundary directly.
- Validation passed in Docker:
  - `npx vitest run tests/unit/status-json.test.ts`
  - `npm run check`
  - `node dist/cli/main.js harness validate --task T-0085 --level done --json --project /workspace`
  - Built CLI status JSON/text smokes for `hadara.ops.status.v1` output
  - Re-ran done-level harness validation after replacing the template `PLAN.md`

## Next Recommended Step

Continue with the next ordered slice: Active Run CLI/MCP Surface, while keeping default MCP read-only and avoiding broad write, shell execution, provider, or live dashboard behavior.
