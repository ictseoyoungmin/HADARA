# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-source-manifest.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts` | Host focused regression path. | No | Failed as expected: host `vitest` not found. | `ev:T-0363:72c3bfa638d94ac6b200b3de` |
| Docker focused `npm run test:focused -- tests/unit/context-source-manifest.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts` | Validate C6.1 source manifest and schema runtime fixtures in the supported container path. | Yes | Passed: 3 files / 29 tests. | `ev:T-0363:0fc9286c6a1e45b0ac9b6c53` |
| `npm run dev:docker-sync-build` | Full Docker build/test and workspace `dist` refresh. | Yes | Failed twice on unrelated existing 5s test timeouts after C6.1 focused tests passed. | `ev:T-0363:d1b2b1425c9b4d939f001d1c` |
| Docker standalone `npm run test:focused -- tests/unit/tui-snapshot.test.ts` | Isolate the first full-suite timeout. | No | Passed: 1 file / 16 tests. | `ev:T-0363:9c3d5872e2194d2196f18705` |
| Docker build-only plus built version smoke | Refresh `dist` after full-suite timeout isolation. | Yes | Passed: `npm run build` succeeded and built `version --verbose --json` reported `build.distLooksStale:false`. | `ev:T-0363:b845f1b45c524d66b79e5936` |
| Evidence resolution record | Mark expected/isolated failed validation records resolved by supported Docker focused/build evidence for close readiness. | Yes | Passed; resolves the host missing-vitest and full-suite timeout evidence records. | `ev:T-0363:aec3cd54336c4e0eb3b95fc7` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | N/A |
| Integration smoke | No | No public command or cache write surface was added in C6.1. | Not Run | N/A |
