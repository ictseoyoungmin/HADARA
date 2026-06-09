# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-09T11:33:26.562Z | command-log | T-0288 /tmp copy npm ci + tsc -p tsconfig.json --noEmit returned exit 0 (typecheck passed) after hardening edits | passed | public | evidence.jsonl |
| 2026-06-09T11:33:29.105Z | command-log | T-0288 focused vitest passed 4 files 26 tests: ci-gate, proof-status, evidence-json, evidence-parallel-append | passed | public | evidence.jsonl |
| 2026-06-09T11:33:31.409Z | command-log | T-0288 real multi-process parallel append test passed 2 tests via tsx child processes: 12 concurrent same-key appends produced 1 jsonl record and 1 EVIDENCE.md row; 12 keyless appends produced 12 untorn records | passed | public | evidence.jsonl |
| 2026-06-09T11:33:33.679Z | command-log | T-0288 regression vitest passed: evidence-lint/list/migration/normalizer/agent-evidence/schema-fixtures 6 files 34 tests and task-close/workbench 3 files 25 tests | passed | public | evidence.jsonl |
| 2026-06-09T11:33:36.205Z | command-log | T-0288 built CLI smoke: ci gate strict no-done returned ok:false CI_GATE_NO_DONE_TASKS; strict --allow-empty returned ok:true warning-only; strict --task T-9999 returned ok:false CI_GATE_TASK_NOT_FOUND | passed | public | evidence.jsonl |
| 2026-06-09T11:33:38.621Z | command-log | T-0288 built CLI smoke: proof status checkedSources now lists full close-source set plus evidence.jsonl; non-JSON evidence add-command repeat printed 'already exists: ev:...' instead of 'updated' | passed | public | evidence.jsonl |
| 2026-06-09T11:39:16.217Z | command-log | T-0288 full check equivalent: /tmp npm-ci copy tsc build exit 0 plus npm test passed 103 files 692 tests (Docker baseline deferred, hadara-dev container absent) | passed | public | evidence.jsonl |
| 2026-06-09T11:41:24.241Z | command-log | Task close validation for T-0288 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:4f9c30f072798f3e535e17f98830bb99d514a1b871ea6640d2c0f92dacb7117e. | passed | public | evidence.jsonl |
