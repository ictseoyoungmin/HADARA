# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node --check scripts/context-routing-performance-baseline.mjs` | Validate benchmark script syntax. | Yes | Passed | `ev:T-0373:24fae15138814164be27956f` |
| `node -e "JSON.parse(...)"` | Validate `.hadara/docs-registry.json` remains parseable. | Yes | Passed | `ev:T-0373:24fae15138814164be27956f` |
| `node scripts/context-routing-performance-baseline.mjs --mounted /tmp/hadara-context-perf-t0373 --task T-0373 --samples 1 --timeout-ms 30000` | Smoke benchmark script and JSON parsing on ext4 copy. | Yes | Passed | `ev:T-0373:24fae15138814164be27956f` |
| `node scripts/context-routing-performance-baseline.mjs --mounted /mnt/f/NowWorking/HADARA-dev --ext4 /tmp/hadara-context-perf-t0373 --task T-0373 --samples 1 --timeout-ms 75000 --markdown docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md` | Measure mounted vs ext4 built CLI workloads. | Yes | Passed | `ev:T-0373:24fae15138814164be27956f` |
| `docker exec hadara-dev ... dashboard-static.test.ts` | Recheck initial full-suite dashboard-static timeout in isolation. | Yes | Passed | `ev:T-0373:24fae15138814164be27956f` |
| `npm run dev:docker-sync-build` | Full Docker validation and dist refresh. | Yes | Passed on retry | `ev:T-0373:24fae15138814164be27956f` |
| `git diff --check` | Whitespace check. | Yes | Passed | `ev:T-0373:24fae15138814164be27956f` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Cache warm execute smoke | No | T-0373 intentionally preserves read/write boundary and does not measure cache writes. | Not Run | Scope decision D-2. |
