# T-0459 Agent UX init scaffold and source document hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0459 |
| Title | Agent UX init scaffold and source document hardening |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/harness/validate.ts | implementation-source | approved | implemented | sha256:144a1d3da07eb94b5be331774c5ee3c375dde92c58f433ccd30abf503db78023 | Source Documents table validation and hash drift checks. |
| src/context/session-start.ts | implementation-source | approved | implemented | sha256:1cabe655c4418b48f4c810cbff11994126c4da7921288c5eb454882479e7eae6 | Session Start guidance and primary next commands. |
| src/cli/init.ts | implementation-source | approved | implemented | sha256:f43abdfe0cd8131e41dbe89e73382b105aabac5506698c6e020c271e0379ff85 | Init command routing and generated scaffold docs. |
| tests/harness/harness-validate.test.ts | implementation-source | approved | implemented | sha256:0bc0cb559a027439c6bae225ac5c22da15c8fbf21643e3f093820c8d31abeb11 | Source Documents markdown path regression coverage. |
| tests/unit/session-start.test.ts | implementation-source | approved | implemented | sha256:abdf1e6b681c97c74d1c0d9a5dc4fed85b20d2c17d0c4bc6b639ac09ba4e2779 | Session Start status-first regression coverage. |
| tests/unit/init.test.ts | implementation-source | approved | implemented | sha256:d1c537194273fddc63d7e25a6be0f04e79d693dfe279f3a4ec4b4af935e6ca60 | Init help no-write regression coverage. |

## Goal

| Goal | Notes |
|---|---|
| Remove three agent UX traps found while dogfooding T-0458. | `TASK.md` Source Documents may be written as inline-code paths, `session start` should point agents at `task status`, and `init --help` must not mutate the current project. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Normalize markdown-wrapped Source Documents path cells before hash validation. | Done | `ev:T-0459:e70d6bc192f446d7ba8b0a95` |
| 2 | Align `session start` no-task and task-scoped guidance with status-first lifecycle flow. | Done | `ev:T-0459:e70d6bc192f446d7ba8b0a95`, `ev:T-0459:d64e7340878e4e57ac628a3d` |
| 3 | Make `hadara init --help` read-only and add no-write coverage. | Done | `ev:T-0459:e70d6bc192f446d7ba8b0a95`, `ev:T-0459:d64e7340878e4e57ac628a3d` |
| 4 | Dogfood fresh `hadara init` in `/tmp` and record scaffold size/accuracy findings. | Done | `ev:T-0459:d64e7340878e4e57ac628a3d` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Source Documents paths wrapped in Markdown inline code validate against the real project file hash. | Yes | Met | `ev:T-0459:e70d6bc192f446d7ba8b0a95` | Required | `src/harness/validate.ts` |
| AC-2 | Session Start recommends `task status` instead of `task next` or `task lifecycle` for both no-task and task-scoped guidance. | Yes | Met | `ev:T-0459:e70d6bc192f446d7ba8b0a95`, `ev:T-0459:d64e7340878e4e57ac628a3d` | Required | `src/context/session-start.ts` |
| AC-3 | `hadara init --help` is read-only and does not create scaffold files. | Yes | Met | `ev:T-0459:e70d6bc192f446d7ba8b0a95`, `ev:T-0459:d64e7340878e4e57ac628a3d` | Required | `src/cli/init.ts` |
| AC-4 | Fresh governed `hadara init` output is checked for document count, verbosity, stale command recommendations, and doctor cleanliness. | Yes | Met | `ev:T-0459:d64e7340878e4e57ac628a3d` | Required | `/tmp/hadara-init-t0459-check` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Broad Docker sync-build | `npm run dev:docker-sync-build`; build passed, full Vitest failed on pre-existing broad fixture drift and was followed by focused rerun. | No | Failed | `ev:T-0459:469f12fd91d04455b1587491`, `ev:T-0459:e70d6bc192f446d7ba8b0a95` |
| Focused Docker tests and build | `npx vitest run tests/unit/init.test.ts tests/unit/session-start.test.ts tests/harness/harness-validate.test.ts && npm run build` in `/tmp/hadara`; 3 files / 50 tests passed. | Yes | Passed | `ev:T-0459:e70d6bc192f446d7ba8b0a95` |
| Built CLI smokes | `init --help`, fresh governed `init` and `init doctor`, no-task `session start`, task-scoped `session start`, and `task status --task T-0459`; fresh governed init created 15 files. | Yes | Passed | `ev:T-0459:d64e7340878e4e57ac628a3d` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/harness/validate.ts | N/A | Normalizes inline-code, angle-bracket, and Markdown-link Source Documents path cells before hash checks. | Prevent human-readable Markdown paths from becoming false missing-file blockers. | `ev:T-0459:e70d6bc192f446d7ba8b0a95` |
| src/context/session-start.ts | N/A | Replaces `task next` / `task lifecycle` guidance with `task status` in primary commands, primary action, command list, and no-task fix hint. | Keep session start aligned with the status cockpit introduced in T-0458. | `ev:T-0459:e70d6bc192f446d7ba8b0a95`, `ev:T-0459:d64e7340878e4e57ac628a3d` |
| src/cli/init.ts | N/A | Adds read-only init command help before mutation routing. | Prevent `hadara init --help` from creating scaffold files in the current project. | `ev:T-0459:e70d6bc192f446d7ba8b0a95`, `ev:T-0459:d64e7340878e4e57ac628a3d` |
| tests/harness/harness-validate.test.ts, tests/unit/session-start.test.ts, tests/unit/init.test.ts | N/A | Adds and updates focused regressions for this agent UX hardening slice. | Keep the dogfooded failure modes covered. | `ev:T-0459:e70d6bc192f446d7ba8b0a95` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | CLI global option order is still command-first: `hadara --project <path> init` prints default help, while `hadara init --project <path>` works. | Open | Built CLI fresh-init smoke |
| RF-2 | Follow-up | Fresh governed init creates 15 files; the core workflow doc is 266 lines. It is accurate and doctor-clean, but future product polish could add a shorter quickstart view without removing the detailed workflow reference. | Open | `/tmp/hadara-init-t0459-check/docs/HADARA_WORKFLOW.md` |
| RF-3 | Risk | Full `dev:docker-sync-build` still fails on broad historical fixture drift unrelated to this capsule; focused affected tests and TypeScript build pass. | Accepted | `ev:T-0459:469f12fd91d04455b1587491`, `ev:T-0459:e70d6bc192f446d7ba8b0a95` |
