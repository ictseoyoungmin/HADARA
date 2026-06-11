# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/command-registry.test.ts tests/unit/help.test.ts tests/unit/tools-list-command-registry.test.ts` | Validate Phase 7.1 registry/help/tools-list drift behavior. | Yes | Blocked on host; Passed in Docker direct Vitest package entry. | Host lacked `vitest`; Docker evidence recorded. |
| `npm run build` | Compile TypeScript and refresh built CLI when possible. | Yes | Blocked on host; Passed in Docker direct TypeScript package entry. | Host lacked `tsc`; Docker build evidence recorded. |
| `npm test` | Run the default project test suite when feasible in the available environment. | Yes | Blocked by timeout-only dashboard/dogfooding failures in Docker direct full Vitest. | Full-suite timeout evidence recorded; focused Phase 7.1 and regression sets passed. |
| `npm run dev:docker-sync-build` | Docker-backed development build/sync preferred by project SOP for CLI changes. | Yes | Blocked: `timeout 120 bash scripts/dev-docker-sync-build.sh --check-only --no-smoke` produced no output before timeout. | Blocked evidence recorded; Docker direct build/tests passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js help` | Verify short default help from built CLI. | Yes | Passed | Built CLI smoke evidence recorded. |
| `node dist/cli/main.js help lifecycle` | Verify lifecycle help surface. | Yes | Passed | Built CLI smoke evidence recorded. |
| `node dist/cli/main.js help command task.close` | Verify command-specific help surface. | Yes | Passed | Built CLI smoke evidence recorded. |
| `node dist/cli/main.js commands --json` | Verify command registry JSON contract. | Yes | Passed | Built CLI smoke evidence recorded; projection checked not to include `capabilitySurfaces`. |
| `node dist/cli/main.js commands --family capsule-lifecycle --json` | Verify registry filtering. | Yes | Passed | Built CLI smoke evidence recorded. |
| Security smoke | No | This task classifies existing write boundaries but does not change permissions, secrets, storage, MCP execution, or shell execution behavior. | Not Required | Scope note only. |
| Integration smoke | No | Integration commands are only classified; no Hermes/MCP runtime behavior changes are planned. | Not Required | Scope note only. |
