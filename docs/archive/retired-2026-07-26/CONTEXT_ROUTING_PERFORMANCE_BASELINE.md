# Context Routing Performance Baseline

Generated: 2026-06-19T09:17:19.488Z

CLI: `dist/cli/main.js`

Task: `T-0373`

Samples per workload: 1

Timeout: 75000 ms

Threshold fixture: `docs/CONTEXT_ROUTING_PERFORMANCE_THRESHOLDS.json`

Re-run with advisory comparison:

```bash
node scripts/context-routing-performance-baseline.mjs --mounted /mnt/f/NowWorking/HADARA-dev --ext4 /tmp/hadara-context-perf-t0373 --task T-0379 --thresholds docs/CONTEXT_ROUTING_PERFORMANCE_THRESHOLDS.json --markdown docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md
```

For a quick Session Start-only regression smoke:

```bash
node scripts/context-routing-performance-baseline.mjs --mounted /mnt/f/NowWorking/HADARA-dev --task T-0379 --workloads session_start,session_start_include_code --thresholds docs/CONTEXT_ROUTING_PERFORMANCE_THRESHOLDS.json
```

Add `--fail-on-regression` only for an explicit local gate. The threshold file is intentionally generous and local-environment-aware; it is not a stable CI SLA.

## mounted

Project root: `/mnt/f/NowWorking/HADARA-dev`

Source: mounted filesystem path

| Workload | Min ms | Avg ms | Max ms | OK | Timeout | Output bytes | Cache mode | Fast path | Sources | Sources read | Degraded | Issue codes |
|---|---:|---:|---:|---|---|---:|---|---|---:|---:|---|---|
| cache_status | 14112.4 | 14112.4 | 14112.4 | yes | no | 9872 | stale | miss | 4516 |  | false | CONTEXT_CACHE_STALE |
| cache_warm_dry_run | 13970.1 | 13970.1 | 13970.1 | yes | no | 11294 | stale | miss | 4516 |  | false | CONTEXT_CACHE_STALE |
| graph | 44710.2 | 44710.2 | 44710.2 | yes | no | 5819127 | extractor-shards | miss |  | 1030 | true | CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED |
| graph_include_code | 64953.9 | 64953.9 | 64953.9 | yes | no | 9312254 | extractor-shards | miss |  | 1354 | true | CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED |
| context_pack | 53553.7 | 53553.7 | 53553.7 | yes | no | 46238 | extractor-shards | miss |  | 1030 | true | CONTEXT_PACK_DEGRADED, CONTEXT_PACK_BUDGET_TRUNCATED |

## ext4

Project root: `/tmp/hadara-context-perf-t0373`

Source: ext4 tmp path

| Workload | Min ms | Avg ms | Max ms | OK | Timeout | Output bytes | Cache mode | Fast path | Sources | Sources read | Degraded | Issue codes |
|---|---:|---:|---:|---|---|---:|---|---|---:|---:|---|---|
| cache_status | 1671.6 | 1671.6 | 1671.6 | yes | no | 1145 | miss | skipped | 4686 |  | false | CONTEXT_CACHE_MISS |
| cache_warm_dry_run | 1616.7 | 1616.7 | 1616.7 | yes | no | 2468 | miss | skipped | 4686 |  | false | CONTEXT_CACHE_MISS |
| graph | 2168.7 | 2168.7 | 2168.7 | yes | no | 5819073 | extractor-shards | skipped |  | 1030 | true | CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED |
| graph_include_code | 2863.1 | 2863.1 | 2863.1 | yes | no | 9312200 | extractor-shards | skipped |  | 1354 | true | CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_EVIDENCE_READ_FAILED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED, CONTEXT_GRAPH_DEGRADED |
| context_pack | 2165.3 | 2165.3 | 2165.3 | yes | no | 46184 | extractor-shards | skipped |  | 1030 | true | CONTEXT_PACK_DEGRADED, CONTEXT_PACK_BUDGET_TRUNCATED |

## Notes

- Measurements invoke the built CLI and suppress raw command output.
- context cache warm is measured in dry-run mode only; this script does not write cache records.
- Durations are local observations for comparing mounted and ext4 behavior, not stable CI gates.
