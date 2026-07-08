# T-0524 Handoff

## Current State

`hadara status --json` is now fast by default. It keeps the `hadara.ops.status.v1` envelope but skips broad operational-debt, known-problem, Task Capsule, and state-consistency scans unless requested.

## Last Completed

| Area | Result |
|---|---|
| CLI | Added `status --detail fast|full`, `status --summary-json`, `status --state-only --json`, and bounded `--state-issue-limit`. |
| Service | Added Task Board status counting, known-problem/debt/state skip options, summary report, and state-only report. |
| Contracts | Updated status JSON, dashboard, operations-status, command-portfolio, README, and test-strategy docs. |
| Registry | Updated `status` command metadata and examples. |

## Validation Baseline

| Check | Result | Evidence |
|---|---|---|
| Focused Vitest: status/state/registry/docs/smoke files | Passed, 6 files / 41 tests | `ev:T-0524:27c4be39ca554616b854a12e` |
| TypeScript build | Passed | `ev:T-0524:27c4be39ca554616b854a12e` |
| Built CLI status smoke | Passed; fast and summary paths took about 1.1s, state-only about 10.2s, full detail about 40.5s on the mounted workspace | `ev:T-0524:27c4be39ca554616b854a12e` |
| Full host Vitest suite | Blocked by host `spawnSync node/bash EPERM`; 148 files passed before blocked failures were reported | `ev:T-0524:4baa7e47eb454beaa70dfe06` |

## Next Recommended Step

| ID | Summary |
|---|---|
| FU-1 | The default command is much faster, but still pays Node/import startup cost. Further sub-second work should target CLI startup/import graph or a cache-backed status read model. |
| FU-2 | Host full-suite EPERM should be treated as environment validation friction; Docker/ext4 remains the stronger spawn-heavy validation path. |
