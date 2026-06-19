# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-19T15:12:57.114Z | command-log | Initial full Docker sync-build for T-0387 hit a protocol-consistency test timeout under worker contention after 137 files passed; this diagnostic failure was retried before close. | failed | public | evidence.jsonl |
| 2026-06-19T15:13:06.996Z | command-log | Context slice/pack boundary validation passed: focused Docker temp-copy tests passed 3 files / 31 tests; retry full Docker sync-build passed 138 files / 907 tests and refreshed dist with distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-19T15:18:32.380Z | command-log | Task close validation for T-0387 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:e0f974c8324f6a0fd5e27955690da32a0701aa98a1e22bd952ab60c592b5afad. | passed | public | evidence.jsonl |
