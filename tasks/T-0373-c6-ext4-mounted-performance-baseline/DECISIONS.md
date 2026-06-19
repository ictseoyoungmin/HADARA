# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Benchmark built CLI workloads by redirecting child stdout to temp files, then parsing summary fields. | Accepted | `context graph` payloads are multi-MB and CLI output can be lost when captured through a child stdout pipe; temp-file capture keeps measurements reliable without terminal flood. | `scripts/context-routing-performance-baseline.mjs` |
| D-2 | Measure `context cache warm` only in dry-run mode. | Accepted | C6 read/write boundaries require explicit cache writes; the user asked for comparison and feedback, not mutation of local cache state. | `docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md` |
| D-3 | Prioritize graph-core/context-pack warm path and mounted-safe freshness proof before broad C5 consumption. | Accepted | Mounted graph/pack workloads measured 44.7-65.0s while ext4 measured 2.2-2.9s; C5 session start cannot safely call live graph/pack on mounted workspaces. | `docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md` |
