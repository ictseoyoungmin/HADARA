# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/protocol-migration.test.ts tests/unit/protocol-cli.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts tests/unit/release-artifact.test.ts` | Validate migration service/CLI/schema/registry and metadata staging changes. | Yes | Passed: 5 files / 29 tests. | Docker temp-copy run in `/tmp/hadara`. |
| `npm run build` | Type-check the TypeScript implementation. | Yes | Passed. | Docker temp-copy run in `/tmp/hadara`. |
| `npm run check` | Run the full repository check when available. | Yes | Partial pass with retry: TypeScript built and 115 files / 746 tests passed before dashboard bootstrap/static parallel timeout; standalone dashboard retry then passed 2 files / 18 tests. | `ev:T-0299:95c8e1...` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI project migration execute smoke | Yes | Confirms actual dispatcher + before-hash execute path applies bounded writes. | Passed: `ok:true`, `changed:3`, protocol marker present; workspace `dist` version smoke reported `0.3.0-rc.1` and `distLooksStale:false`. | `ev:T-0299:f7f227...` |
| Security smoke | No | No secret, permission, MCP, or external execution boundary changed. | Not Run | Scope note. |
| Integration smoke | No | No MCP/provider/dashboard runtime integration changed. | Not Run | Scope note. |
| Release publish smoke | No | Publish is explicitly out of scope until later final readiness capsule. | Not Run | Scope note. |
