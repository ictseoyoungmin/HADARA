# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-25T06:34:51.993Z | command-log | Built CLI context pack smoke passed in a disposable /tmp project; output included read-only agentActions with structured context slice args and cleanup completed. | passed | public | evidence.jsonl |
| 2026-06-25T06:34:51.992Z | command-log | Docker build passed; focused context-pack/context-graph/session-start/schema tests passed 4 files / 29 tests; workspace dist refreshed. | passed | public | evidence.jsonl |
| 2026-06-25T06:34:52.265Z | command-log | Mounted workspace built CLI context pack smoke for T-0415 produced no output for about 90 seconds and was interrupted; this matches known mounted broad-read residual, while /tmp built smoke and focused tests passed. | failed | public | evidence.jsonl |
| 2026-06-25T06:34:52.265Z | command-log | git diff --check passed after T-0415 edits. | passed | public | evidence.jsonl |
| 2026-06-25T06:35:19.768Z | command-log | Mounted workspace live context-pack timeout classified as accepted residual broad-read performance behavior for this capsule; functional validation uses focused Docker tests and /tmp built CLI smoke. resolves:ev:T-0415:570b2021b1bf4b1c869b836a | passed | public | evidence.jsonl |
| 2026-06-25T06:39:22.864Z | command-log | Post-doc git diff --check passed after T-0415 shared state, handoff, acceptance, and slice docs updates. | passed | public | evidence.jsonl |
| 2026-06-25T06:41:39.730Z | command-log | Task close validation for T-0415 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:675a5a153ff6f74db541cabbc0955b498bf6799fce4627e443ecb216b5140790. | passed | public | evidence.jsonl |
