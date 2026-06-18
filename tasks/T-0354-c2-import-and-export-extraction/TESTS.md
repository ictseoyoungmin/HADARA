# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/code-index.test.ts` | Validate C2 import/export extraction, resolution, edges, warnings, and schema-valid reports. | Yes | Passed: 1 file / 6 tests in Docker `/tmp/hadara`. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
| `npm run build` | Compile TypeScript before full suite and dist refresh. | Yes | Passed in Docker `/tmp/hadara`. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
| `npm run check` | Run the full repository check when available. | Yes | Passed: 130 files / 829 tests in Docker `/tmp/hadara`. | `ev:T-0354:9093ae17f3c64a54b46b319c` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI version smoke | Yes | Dist was refreshed after build. | Passed with `distLooksStale:false`. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
| Built internal code-index schema smoke | Yes | No public CLI was added, so verify built helper and schema runtime load from `dist`. | Passed: schema-valid report over workspace with 315 files, 1422 imports, 1045 exports, 782 edges, and 58 warning-level unresolved relative imports. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
| `git diff --check` | Yes | Verify whitespace before evidence/close. | Passed. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
