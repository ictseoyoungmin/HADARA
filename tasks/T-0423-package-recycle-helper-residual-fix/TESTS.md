# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/package-recycle.test.ts` | Fast host attempt before Docker baseline. | No | Blocked: host `node_modules` absent, `vitest` not found. | `ev:T-0423:4b77d940eac145e399be7d74` |
| `node dist/cli/main.js dev docker-check --focused tests/unit/package-recycle.test.ts tests/unit/command-registry.test.ts tests/unit/tools-list-command-registry.test.ts --sync-dist --before-hash <hash> --json` | Validate source behavior and registry/tool metadata; refresh workspace `dist`. | Yes | Passed. | `ev:T-0423:cd03a65c043f42848901fab0` |
| Built `package recycle --json` dry-run smoke | Verify default profile shape in built CLI. | Yes | Passed: default omitted `context-graph`; `--include-graph` added it. | `ev:T-0423:5205a44ac4f546f28d15ae49` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Registry-installed execute smoke | Yes | Proves the fixed helper against published `hadara@next` consumer paths. | Passed: `hadara@next` resolved/installed as `0.3.4-rc.0`, default fast smoke passed, cleanup passed. | `ev:T-0423:b1c67ff5ac4540b5930c3d5f` |
