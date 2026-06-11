# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker TypeScript compile | `docker exec -w /workspace hadara-dev node node_modules/typescript/bin/tsc -p tsconfig.json`. | Yes | Passed | `ev:T-0295:f6cfbc297cec4a7490c9db3b` |
| Focused docs cleanup tests | `docker exec -w /workspace hadara-dev node node_modules/vitest/vitest.mjs run tests/unit/docs-mark.test.ts tests/unit/docs-archive.test.ts tests/unit/docs-required-reading.test.ts tests/unit/docs-doctor.test.ts tests/unit/schema-fixtures.test.ts tests/unit/command-registry.test.ts`. | Yes | Passed, 6 files / 21 tests. | `ev:T-0295:8c295540fbc545c6a129b8f5` |
| Built CLI smoke | `node dist/cli/main.js` init/docs mark/docs required-reading/docs archive/docs doctor flow in `/tmp`. | Yes | Passed | `ev:T-0295:a20a5948a24849e4a8fea092` |
| git diff --check | Check whitespace and conflict markers. | Yes | Passed | `ev:T-0295:6ab234abb05e4ddc93f8a597` |
| Standard Docker wrapper | `timeout 120 bash scripts/dev-docker-sync-build.sh --check-only --no-smoke`. | Yes | Passed, 115 test files / 741 tests. | `ev:T-0295:43758072d09e4f01b71f25c7` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permissions, secret, MCP, provider, or execution boundary changed. | Not Run | N/A |
| Integration smoke | No | CLI smoke covered the new docs command surfaces without external integrations. | Passed via built CLI smoke | `ev:T-0295:a20a5948a24849e4a8fea092` |
