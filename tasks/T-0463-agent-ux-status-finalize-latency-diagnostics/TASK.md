# T-0463 Agent UX status finalize latency diagnostics

## Identity

| Field | Value |
|---|---|
| ID | T-0463 |
| Title | Agent UX status finalize latency diagnostics |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| `src/cli/task.ts` | implementation-source | approved | implemented | sha256:3d53af5240d9eded7c42bf27bd104e17a21d66598afc1dcc6eb0a70239991ffa | Adds CLI-owned diagnostics attachment for `task status` and `task finalize`. |
| `src/services/task-workbench.ts` | implementation-source | approved | implemented | sha256:c54aa894e6dc73e6f26fd4112d510105233b551bf9bc250385a91cfd4cbba052 | Carries diagnostics through status/workbench JSON and text formatting. |
| `src/task/task-finalize.ts` | implementation-source | approved | implemented | sha256:c5ca1b6d1e4c1c4c7e3aa19f476fad793ad9312fde333c5164c129f4a90696a7 | Carries finalize diagnostics through JSON and text formatting. |
| `src/schemas/task-status.schema.json` | constraint | approved | implemented | sha256:7e1b7a89848142505dd1b87244f216d531846f4e64cc7d8b12239751f9229aae | Allows additive select-work status diagnostics. |
| `src/schemas/task-workbench.schema.json` | constraint | approved | implemented | sha256:2a214ee7eec6cda951ce7a23c9680b77a3d24fd08e1b9887207c96984efc0429 | Allows additive selected-task workbench diagnostics. |
| `src/schemas/task-finalize.schema.json` | constraint | approved | implemented | sha256:6b15256b850a4e43cdce06664da950532f9710b23cc4e0ba6a197143df85dc26 | Allows additive finalize diagnostics. |
| `tests/unit/task-workbench.test.ts` | reference | approved | implemented | sha256:c7b4057011e5c1de90e0e7b65327759973a919693c49048b1c55d52636403924 | Covers CLI status diagnostics and schema validation. |
| `tests/unit/task-finalize.test.ts` | reference | approved | implemented | sha256:8b3742f42b4358da9cd6d89eac1898cdbb48e697f10676211dc36dc552827aa5 | Covers CLI finalize diagnostics and schema validation. |
| `tests/unit/schema-fixtures.test.ts` | reference | approved | implemented | sha256:360b42680e46ae1ebba0ecb14c5f8027a568eb67cbb7a4909acd4f5f6ba6f766 | Confirms updated schema fixtures compile. |

## Goal

| Goal | Notes |
|---|---|
| Add CLI latency diagnostics to task status and finalize outputs. | Long mounted-workspace runs should leave structured `durationMs` / `slow` metadata and text duration hints without changing lifecycle semantics or writing prose automatically. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the latency diagnostics contract as additive CLI metadata. | Done | This TASK.md |
| 2 | Attach diagnostics to `task status` select-work, selected-task, and `task finalize` CLI reports. | Done | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| 3 | Update schemas, formatters, and focused tests. | Done | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| 4 | Prove built CLI output on the mounted workspace and record sandbox residual honestly. | Done | `ev:T-0463:b8afb3afd6544e5d8ce7319f`, `ev:T-0463:e51a09de51e649ab9d9f1f45` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `task status --json` select-work and selected-task CLI reports include additive diagnostics with `generatedBy`, `commandPath`, `durationMs`, `slowThresholdMs`, and `slow`. | Yes | Met | `ev:T-0463:d7ed90ac429d428eb84ce44a` | Required | `src/cli/task.ts`, `tests/unit/task-workbench.test.ts` |
| AC-2 | `task finalize --json` CLI reports include additive diagnostics with `commandPath: task.finalize`. | Yes | Met | `ev:T-0463:d7ed90ac429d428eb84ce44a` | Required | `src/cli/task.ts`, `tests/unit/task-finalize.test.ts` |
| AC-3 | Human-readable `task status` and `task finalize` output includes duration information when diagnostics are present. | Yes | Met | `ev:T-0463:d7ed90ac429d428eb84ce44a` | Required | `src/services/task-workbench.ts`, `src/task/task-finalize.ts` |
| AC-4 | Status/workbench/finalize schemas accept diagnostics as additive CLI-owned metadata. | Yes | Met | `ev:T-0463:d7ed90ac429d428eb84ce44a` | Required | `src/schemas/task-status.schema.json`, `src/schemas/task-workbench.schema.json`, `src/schemas/task-finalize.schema.json` |
| AC-5 | Built CLI smokes prove actual mounted status/finalize diagnostics output. | Yes | Met | `ev:T-0463:b8afb3afd6544e5d8ce7319f`, `ev:T-0463:e51a09de51e649ab9d9f1f45` | Required | `dist/cli/main.js` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker validation | `npx vitest run tests/unit/task-workbench.test.ts tests/unit/task-finalize.test.ts tests/unit/schema-fixtures.test.ts && npm run build` in `hadara-dev` with changed files overlaid | Yes | Passed | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| Built CLI direct smoke | `node dist/cli/main.js task status --task T-0463 --json`; `node dist/cli/main.js task finalize --task T-0463 --json` | Yes | Passed | `ev:T-0463:b8afb3afd6544e5d8ce7319f` |
| Nested child-process smoke | Node `spawnSync` wrapper around built CLI smokes | No | Failed | `ev:T-0463:56c9cbeae4a74a93a459842e`, `ev:T-0463:e51a09de51e649ab9d9f1f45` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| `src/cli/task.ts` | L23-L33, L135-L182, L265-L278 | Added CLI diagnostics timing helper and attached it to status/finalize reports. | Make long command latency visible in JSON/text output. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `src/services/task-workbench.ts` | L144-L165, L376-L413 | Added optional diagnostics to status/workbench report types and formatters. | Surface duration information to both JSON and text consumers. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `src/task/task-finalize.ts` | L44-L45, L112-L116 | Added optional finalize diagnostics and text duration output. | Keep finalize latency visible without changing finalize execution semantics. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `src/schemas/task-status.schema.json` | L18-L86 | Registered `diagnostics` as additive CLI metadata. | Preserve schema compatibility for select-work status output. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `src/schemas/task-workbench.schema.json` | L35-L39, L157-L169 | Registered `diagnostics` as additive CLI metadata. | Preserve schema compatibility for selected-task status output. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `src/schemas/task-finalize.schema.json` | L95-L107 | Registered `diagnostics` as additive CLI metadata. | Preserve schema compatibility for finalize output. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `tests/unit/task-workbench.test.ts` | L200-L249 | Added status diagnostics assertions and schema validation. | Prove selected-task and select-work CLI report payloads. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `tests/unit/task-finalize.test.ts` | L271-L283 | Added finalize diagnostics assertions and schema validation. | Prove finalize CLI report payload. | `ev:T-0463:d7ed90ac429d428eb84ce44a` |
| `dist/` | N/A | Refreshed built CLI from Docker build output. | Keep workspace CLI current for direct smokes. | `ev:T-0463:b8afb3afd6544e5d8ce7319f` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Diagnostics are emitted after command completion; they do not provide live progress while a slow mounted-workspace command is running. | Open | Candidate T-0464 if repeated latency remains the main agent UX blocker. |
| RF-2 | Risk | Nested Node child-process smokes can fail with sandbox `spawnSync node EPERM` even when direct CLI commands pass. | Mitigated | `ev:T-0463:e51a09de51e649ab9d9f1f45` |
