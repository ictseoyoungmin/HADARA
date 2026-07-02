# T-0475 Compatibility-only legacy sidecar cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0475 |
| Title | Compatibility-only legacy sidecar cleanup |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/task/task-templates.ts | implementation-source | approved | implemented | sha256:d8eee9fc3e4f6f4d31a2915401073e80c56757d6ab484c1a9c0e5530ae75191a | Template dead sidecar factory cleanup. |
| src/task/task-upgrade-scaffold.ts | implementation-source | approved | implemented | sha256:10fa9fe429d869faa8ece3937c9a8317a3768a53d77c4d115ee2800dd2c88e1c | Task upgrade scaffold current-file target cleanup. |
| src/services/write-preflight.ts | implementation-source | approved | implemented | sha256:5f634ca265bc533a6668f675030c59548a62cbc8ed8742ee4a475a4e88ffe190 | Task create write prediction alignment. |
| src/tui/constants.ts | implementation-source | approved | implemented | sha256:a077223f5fa3abd8fabec7508632fb1b9f231ba9ed44653246429a08fe9406ad | Default TUI task document tab surface. |
| tests/unit/task-create.test.ts | reference | approved | implemented | sha256:41bec859529d9206504411300deb09642f56a67949c3888484fae23dae79a62f | Template create regression expectations. |
| tests/unit/task-upgrade-scaffold.test.ts | reference | approved | implemented | sha256:7fa9c0d31813d889626f014e1f23810d5d3de68b396a166b77fce223433581fa | Upgrade scaffold current-file regression expectations. |
| tests/unit/write-preflight.test.ts | reference | approved | implemented | sha256:98f8e862da9fb5eb3e409b18d59efc498cad43169783abba12706e163108dbb5 | Task create write prediction regression. |
| tests/unit/tui-snapshot.test.ts | reference | approved | implemented | sha256:f7ea722b5bdc4cdcb2ea071fda236cc3ac368e557e49688b7083421641f89f66 | TUI current-doc tab snapshot regression. |
| tests/unit/tui-state.test.ts | reference | approved | implemented | sha256:9131517c189430abee3665efb85dc418d2399153084d4b28f55b2c2178f7b391 | TUI document-key state regression. |
| tests/unit/tui-terminal.test.ts | reference | approved | implemented | sha256:78b0b5bbefd271882944285bd0bfc15df5ca24f749fbb0375042e94eac53bbee | TUI mouse document-tab regression. |

## Goal

| Goal | Notes |
|---|---|
| Remove or hide compatibility-only task sidecar scaffolding from current user-facing surfaces while preserving legacy read compatibility. | New Task Capsules stay on the 0.4 `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, `evidence.jsonl` model; legacy sidecars remain readable where older capsules provide them. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Audit product-facing legacy sidecar references and choose only current-surface cleanup. | Done | Source search and T-0475 task contract. |
| 2 | Remove ignored template sidecar factories, align write-preflight task-create write list, shrink TUI default document tabs, and retarget upgrade-scaffold frames to current capsule docs. | Done | `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:2f903acccdb647639c859021`, `ev:T-0475:e93357bbff7d4ea18e287b79` |
| 3 | Validate focused create/write-preflight/TUI/upgrade-scaffold tests, build/dist refresh, built CLI smoke, and close audit. | Done | `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:2f903acccdb647639c859021`, `ev:T-0475:e93357bbff7d4ea18e287b79` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Task templates no longer carry ignored `ACCEPTANCE.md`, `TESTS.md`, or `RISKS.md` sidecar factories. | Yes | Met | `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:e93357bbff7d4ea18e287b79` | Required | src/task/task-templates.ts |
| AC-2 | `write preflight task create` predicts only current 0.4 task capsule files plus `docs/TASK_BOARD.md`. | Yes | Met | `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:e93357bbff7d4ea18e287b79` | Required | src/services/write-preflight.ts |
| AC-3 | TUI default document tabs expose current capsule docs only: `TASK.md`, `EVIDENCE.md`, and `HANDOFF.md`. | Yes | Met | `ev:T-0475:0fec147f12bb41c0bd76a38d` | Required | src/tui/constants.ts |
| AC-4 | `task upgrade-scaffold` repairs current capsule frames instead of creating removed legacy sidecar files. | Yes | Met | `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:be814f8e9e3941c5916ed900` | Required | src/task/task-upgrade-scaffold.ts |
| AC-5 | Legacy sidecar read compatibility remains available for old capsules and fixtures where explicitly provided. | Yes | Met | `ev:T-0475:0fec147f12bb41c0bd76a38d` | Required | src/tui/read-model.ts |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused create/write-preflight/TUI/upgrade-scaffold tests | docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0475 && npx vitest run tests/unit/task-upgrade-scaffold.test.ts tests/unit/task-create.test.ts tests/unit/write-preflight.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-state.test.ts tests/unit/tui-terminal.test.ts tests/unit/tui-read-model.test.ts' | Yes | Passed | `ev:T-0475:0fec147f12bb41c0bd76a38d` |
| Build and dist refresh | docker exec hadara-dev bash -lc 'cd /tmp/hadara-t0475 && npm run build && cp -a /tmp/hadara-t0475/dist/. /workspace/dist/' | Yes | Passed | `ev:T-0475:2f903acccdb647639c859021` |
| Built CLI write-preflight/template smoke | node dist/cli/main.js write preflight task create 'Sidecar cleanup smoke' --json and template create smoke | Yes | Passed | `ev:T-0475:e93357bbff7d4ea18e287b79` |
| Close audit | node dist/cli/main.js task audit-close --task T-0475 --json | Yes | Passed | See `EVIDENCE.md` close proof slot. |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/task/task-templates.ts | module:task templates | Removed ignored legacy sidecar file factories and dead helper functions. | Template metadata should describe current 0.4 Task Capsule files instead of carrying unreachable sidecar scaffolds. | `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:e93357bbff7d4ea18e287b79` |
| src/task/task-upgrade-scaffold.ts | module:task upgrade scaffold | Retargeted frame insertion to current `TASK.md`, `EVIDENCE.md`, and `HANDOFF.md` surfaces. | Scaffold upgrade should not recreate removed legacy sidecars for current capsules. | `ev:T-0475:0fec147f12bb41c0bd76a38d` |
| src/services/write-preflight.ts | function:taskCreateReport | Reduced task-create predicted writes to current capsule files plus Task Board. | Preflight should match actual current write behavior. | `ev:T-0475:0fec147f12bb41c0bd76a38d`, `ev:T-0475:e93357bbff7d4ea18e287b79` |
| src/tui/constants.ts | module:TUI document tabs | Default detail tabs now expose only current capsule documents. | New 0.4 capsules should not display removed sidecar docs as primary UI. | `ev:T-0475:0fec147f12bb41c0bd76a38d` |
| tests/unit/*.test.ts | focused regression tests | Updated upgrade-scaffold, write-preflight, and TUI expectations around current capsule docs. | Preserve intended behavior while removing legacy default exposure. | `ev:T-0475:0fec147f12bb41c0bd76a38d` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical specs and compatibility fixtures still mention legacy sidecars by design; this capsule does not rewrite history or remove explicit legacy fixture coverage. | Accepted | docs/AGENT_HANDOFF.md |
