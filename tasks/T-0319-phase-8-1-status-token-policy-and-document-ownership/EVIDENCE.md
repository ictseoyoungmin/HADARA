# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-15T09:37:37.232Z | command-log | Attempted standard Docker sync build after status policy template changes; build and most tests ran, but full suite failed on existing docs archive/required-reading 5s timeouts before dist sync. | failed | public | evidence.jsonl |
| 2026-06-15T09:38:01.151Z | command-log | Focused validation passed: git diff --check; Docker /tmp/hadara init focused test passed 21 tests; workspace dist refreshed; built CLI version smoke reported distLooksStale=false; docs doctor ok with known warnings; docs required-reading ok; draft harness validation ok. | passed | public | evidence.jsonl |
| 2026-06-15T09:46:38.349Z | command-log | Policy resolution resolves:ev:T-0319:ee619e447bc046bc8602b863: full Docker timeout is retained as non-blocking residual risk for this docs/template capsule; scoped policy guidance and generated template behavior were verified by later focused validation evidence. | passed | public | evidence.jsonl |
| 2026-06-15T09:48:30.255Z | command-log | Task close validation for T-0319 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:fe0a0c791be0979b463f9525c04c87100b5eda8b63c71ae3f35083aa127cb3e6. | passed | public | evidence.jsonl |
| 2026-06-15T09:50:32.833Z | command-log | Task close validation for T-0319 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:62ded7e669d2b613466edc2e2abe075b01a6a92a73d0bad7dfc8bfdfba92c60b. | passed | public | evidence.jsonl |
