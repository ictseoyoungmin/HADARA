# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0475:d82872b550b044c9aabd9307 | passed | policy | Focused create/write-preflight/TUI regression passed after updating the mouse-tab fixture: task-create 7 tests, write-preflight 5 tests, tui-snapshot 16 tests, tui-state 10 tests, tui-terminal 13 tests, and tui-read-model 5 tests. resolves: ev:T-0475:fe8240114a974a71be611181 |
| ev:T-0475:70d3822974d84e1297d8154a | passed | operation | Docker TypeScript build passed in /tmp/hadara-t0447 after syncing current src, and workspace dist was refreshed. |
| ev:T-0475:e93357bbff7d4ea18e287b79 | passed | release | Built CLI smoke passed: write preflight task create predicted TASK.md, EVIDENCE.md, evidence.jsonl, HANDOFF.md, and docs/TASK_BOARD.md only; release-read-model template create produced exactly EVIDENCE.md, HANDOFF.md, TASK.md, and evidence.jsonl. |
| ev:T-0475:a246441b2922459a9353badd | passed | validation | Focused create/write-preflight/TUI regression passed after updating the mouse-tab fixture; this resolves the earlier failed focused test attempt. |
| ev:T-0475:be814f8e9e3941c5916ed900 | passed | validation | Expanded focused compatibility cleanup suite passed: ta[REDACTED] 6 tests plus task-create, write-preflight, TUI snapshot/state/terminal/read-model for 62 total tests. This resolves the idempotent rerun fixture failure. |
| ev:T-0475:2f903acccdb647639c859021 | passed | validation | Docker TypeScript build passed and workspace dist was refreshed. |
| ev:T-0475:9577c311eba34eda900123c5 | passed | validation | Focused task scaffold cleanup tests passed: ta[REDACTED] 6 tests and task-create 7 tests. |
| ev:T-0475:0fec147f12bb41c0bd76a38d | passed | validation | Expanded focused compatibility cleanup suite passed: ta[REDACTED] 6 tests plus task-create, write-preflight, TUI snapshot/state/terminal/read-model for 62 total tests. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0475:4aa95293ce3f437986a71d42 |
| close evidence | passed | ev:T-0475:ef469cbbed0c41059844c704 |
| close evidence | passed | ev:T-0475:831feeb01423468099108cd4 |
| close evidence | passed | ev:T-0475:9852708a2ac34a38aa81f296 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0475:fe8240114a974a71be611181 | failed | Focused create/write-preflight/TUI test run failed once after TUI tab shrink: tui-terminal mouse tab fixture expected TASK.md but click selected EVIDENCE.md under the new tab layout. | Resolved | ev:T-0475:a246441b2922459a9353badd |
| ev:T-0475:e8f6bd1e5e7f40318bcb560a | failed | Expanded focused suite failed once after adding ta[REDACTED] coverage: idempotent rerun returned a beforeHash instead of null while all actions were skipped. | Resolved | ev:T-0475:be814f8e9e3941c5916ed900 |
<!-- /hadara:slot -->
