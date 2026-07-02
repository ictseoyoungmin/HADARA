# HADARA 0.4.0-rc.0 Installed Dogfood Report

## Summary

- Package under test: `hadara@0.4.0-rc.0`, installed globally in a fresh unmounted `node:22-bookworm` container.
- Dogfood project: `/root/flowforge-mvp`.
- MVP: FlowForge, a local-first release planning board with file persistence, REST API, static browser UI, import/export, readiness report, and HTTP smoke test.
- HADARA capsules created inside the dogfood project: 12.
- Non-document software LOC: 5397.
- HADARA commands measured: 39.
- Total measured HADARA command time: 3.30s.
- Approximate HADARA command share of measured session window: 34.7%.

## Per-Capsule HADARA Time

| Capsule | Title | HADARA commands | HADARA time |
|---|---:|---:|---:|
| T-0001 | Define FlowForge product and technical spec | 2 | 0.23s |
| T-0002 | Build file backed data model | 2 | -1.26s |
| T-0003 | Build HTTP API and static server | 2 | 0.24s |
| T-0004 | Build dashboard shell and navigation | 2 | 0.23s |
| T-0005 | Build board and table views | 2 | 0.24s |
| T-0006 | Build item editor and filters | 2 | 0.24s |
| T-0007 | Build timeline and risk matrix | 2 | 0.23s |
| T-0008 | Build readiness report generator | 2 | 0.24s |
| T-0009 | Build import export workflow | 2 | 0.24s |
| T-0010 | Add smoke tests and seeded data | 2 | 0.23s |
| T-0011 | Measure HADARA command UX | 2 | 0.24s |
| T-0012 | Package dogfood report and handoff | 3 | 0.54s |

## Command Timing Detail

| Label | Duration | Output lines | Output bytes | Exit |
|---|---:|---:|---:|---:|
| init governed | 0.10s | 99 | 2512 | 0 |
| init doctor | 0.09s | 13 | 262 | 0 |
| task create: Define FlowForge product and technical spec | 0.12s | 19 | 448 | 0 |
| task status: T-0001 | 0.12s | 249 | 8190 | 0 |
| evidence add: T-0001 | 0.11s | 29 | 937 | 0 |
| task create: Build file backed data model | 0.12s | 19 | 418 | 0 |
| task status: T-0002 | -0.60s | 249 | 7980 | 0 |
| evidence add: T-0002 | -0.66s | 29 | 907 | 0 |
| task create: Build HTTP API and static server | 0.12s | 19 | 426 | 0 |
| task status: T-0003 | 0.12s | 249 | 8036 | 0 |
| evidence add: T-0003 | 0.12s | 29 | 915 | 0 |
| task create: Build dashboard shell and navigation | 0.12s | 19 | 434 | 0 |
| task status: T-0004 | 0.12s | 249 | 8092 | 0 |
| evidence add: T-0004 | 0.11s | 29 | 923 | 0 |
| task create: Build board and table views | 0.13s | 19 | 416 | 0 |
| task status: T-0005 | 0.12s | 249 | 7966 | 0 |
| evidence add: T-0005 | 0.12s | 29 | 905 | 0 |
| task create: Build item editor and filters | 0.12s | 19 | 420 | 0 |
| task status: T-0006 | 0.12s | 249 | 7994 | 0 |
| evidence add: T-0006 | 0.12s | 29 | 909 | 0 |
| task create: Build timeline and risk matrix | 0.12s | 19 | 422 | 0 |
| task status: T-0007 | 0.12s | 249 | 8008 | 0 |
| evidence add: T-0007 | 0.12s | 29 | 911 | 0 |
| task create: Build readiness report generator | 0.12s | 19 | 426 | 0 |
| task status: T-0008 | 0.12s | 249 | 8036 | 0 |
| evidence add: T-0008 | 0.12s | 29 | 915 | 0 |
| task create: Build import export workflow | 0.12s | 19 | 418 | 0 |
| task status: T-0009 | 0.12s | 249 | 7980 | 0 |
| evidence add: T-0009 | 0.12s | 29 | 907 | 0 |
| task create: Add smoke tests and seeded data | 0.14s | 19 | 424 | 0 |
| task status: T-0010 | 0.12s | 249 | 8022 | 0 |
| evidence add: T-0010 | 0.12s | 29 | 913 | 0 |
| task create: Measure HADARA command UX | 0.12s | 19 | 412 | 0 |
| task status: T-0011 | 0.12s | 249 | 7938 | 0 |
| evidence add: T-0011 | 0.12s | 29 | 901 | 0 |
| task create: Package dogfood report and handoff | 0.12s | 19 | 430 | 0 |
| task status: T-0012 | 0.13s | 249 | 8064 | 0 |
| evidence add: T-0012 | 0.12s | 29 | 919 | 0 |
| validation smoke: T-0012 | 0.29s | 3 | 109 | 0 |

## Slowest Commands

| Label | Duration | Output lines |
|---|---:|---:|
| validation smoke: T-0012 | 0.29s | 3 |
| task create: Add smoke tests and seeded data | 0.14s | 19 |
| task status: T-0012 | 0.13s | 249 |
| task create: Build board and table views | 0.13s | 19 |
| task create: Build timeline and risk matrix | 0.12s | 19 |
| evidence add: T-0009 | 0.12s | 29 |
| task status: T-0003 | 0.12s | 249 |
| task status: T-0006 | 0.12s | 249 |

## Longest Outputs

| Label | Output lines | Output bytes |
|---|---:|---:|
| task status: T-0001 | 249 | 8190 |
| task status: T-0002 | 249 | 7980 |
| task status: T-0003 | 249 | 8036 |
| task status: T-0004 | 249 | 8092 |
| task status: T-0005 | 249 | 7966 |
| task status: T-0006 | 249 | 7994 |
| task status: T-0007 | 249 | 8008 |
| task status: T-0008 | 249 | 8036 |

## Confusing Or Unnecessary CLI Output

- `hadara init --json` emits a large success payload. It is machine-readable, but for humans it mixes initialization result, document inventory, and next-step guidance in one block. A compact default plus `--verbose-json` would make dogfood logs easier to scan.
- `task create --json` is useful but the task id is nested enough that shell extraction requires defensive parsing. A top-level stable `taskId` field would reduce script glue.
- `task status --json` is valuable, but the output is long for quick per-capsule checks. A short mode that reports phase, blockers, and next action only would reduce noise.
- `validation run` records evidence well, but when wrapped in automation the boundary between the child command output and HADARA evidence summary is not visually obvious in plain output.

## UX Improvement Ideas

- Add `--quiet-json` or `--summary-json` for common automation paths: init, task create, task status, validation run.
- Add `task create --print-id` or guarantee a top-level `taskId` in every JSON response.
- Add a `task batch create` command accepting newline titles or JSON input. Creating 10-20 capsules is possible today, but command overhead dominates setup.
- Add an optional timing footer for HADARA commands, disabled by default, so dogfood timing does not require wrappers.
- Add a `validation run --label` field that is surfaced prominently in evidence, making repeated smoke runs easier to compare.

## Structural Improvement Ideas

- Provide a first-class dogfood/project scaffold workflow that initializes a governed project, creates a capsule set, and emits a metrics file.
- Consider a stable JSON envelope across commands: `ok`, `command`, `taskId`, `paths`, `nextActions`, `issues`.
- Expose a low-noise lifecycle API for capsule state transitions so scripts do not need to alternate status/evidence calls as much.
- Make command output contracts part of compatibility tests for release candidates, especially fields used by shell automation.

## What Worked Well

- Global npm install worked cleanly in a fresh unmounted container.
- The CLI was usable without repository source files, which is the key installed-package requirement.
- Task creation, status checks, evidence append, and validation execution all worked together in an isolated project.
- Evidence files were created automatically, reducing manual bookkeeping.
- The protocol nudged the dogfood project toward explicit spec, validation, and handoff artifacts instead of an untracked throwaway app.

## MVP Run Instructions

```bash
cd /root/flowforge-mvp
npm run smoke
npm start
```

Open `http://127.0.0.1:4177` when running inside an environment with port access.
