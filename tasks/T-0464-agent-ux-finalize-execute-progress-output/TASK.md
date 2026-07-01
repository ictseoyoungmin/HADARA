# T-0464 Agent UX finalize execute progress output

## Identity

| Field | Value |
|---|---|
| ID | T-0464 |
| Title | Agent UX finalize execute progress output |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| `src/task/task-finalize.ts` | implementation-source | approved | implemented | sha256:d3dca14f6256dcd20dc930ecb3a97aedb0eb0a984982b0ceffc428eaa009027a | Adds progress callback events inside finalize execute. |
| `src/cli/task.ts` | implementation-source | approved | implemented | sha256:09f9f01c59b1bb0e4f0a704d165efc340a4b37dea3f9d0bf82e5c72b8ea3b927 | Writes finalize execute progress events to stderr. |
| `tests/unit/task-finalize.test.ts` | reference | approved | implemented | sha256:03be6b6dd860b19106ac3787118da00d1824d69e561052051f2d502509e12e1e | Covers progress event ordering during execute. |

## Goal

| Goal | Notes |
|---|---|
| Emit live finalize execute progress without breaking JSON stdout. | `task finalize --execute --json` should show step progress on stderr while keeping the final report as JSON on stdout. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the progress boundary as execute-only stderr output. | Done | This TASK.md |
| 2 | Add service progress events for finish, refresh, ready, close, and audit stages. | Done | `ev:T-0464:51c58e7d001d42b8b4b009c2` |
| 3 | Add CLI stderr writer and focused regression coverage. | Done | `ev:T-0464:51c58e7d001d42b8b4b009c2` |
| 4 | Prove built CLI progress output in a disposable project. | Done | `ev:T-0464:c3125378748d4fb79980cfe1` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Finalize execute exposes ordered progress events for major lifecycle stages. | Yes | Met | `ev:T-0464:51c58e7d001d42b8b4b009c2` | Required | `src/task/task-finalize.ts`, `tests/unit/task-finalize.test.ts` |
| AC-2 | CLI progress output is emitted only during execute and uses stderr so JSON stdout remains the final report channel. | Yes | Met | `ev:T-0464:c3125378748d4fb79980cfe1` | Required | `src/cli/task.ts` |
| AC-3 | Existing finalize execute behavior remains guarded by plan hash and stop-on-blocker semantics. | Yes | Met | `ev:T-0464:51c58e7d001d42b8b4b009c2` | Required | `tests/unit/task-finalize.test.ts` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker validation | `npx vitest run tests/unit/task-finalize.test.ts && npm run build` in `hadara-dev` with changed files overlaid | Yes | Passed | `ev:T-0464:51c58e7d001d42b8b4b009c2` |
| Built CLI disposable smoke | Basic init under `/tmp/hadara-t0464-progress-smoke`, task create, finalize dry-run, then finalize execute with reviewed plan hash | Yes | Passed | `ev:T-0464:c3125378748d4fb79980cfe1` |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| `src/task/task-finalize.ts` | L89-L247 | Added progress event type, execute option, and stage event emission around finish/refresh/ready/close/audit. | Give callers live step-level progress while finalize execute is running. | `ev:T-0464:51c58e7d001d42b8b4b009c2` |
| `src/cli/task.ts` | L6-L272 | Passed execute-only progress writer into finalize and wrote progress lines to stderr. | Keep JSON stdout clean while making long execute runs visible. | `ev:T-0464:c3125378748d4fb79980cfe1` |
| `tests/unit/task-finalize.test.ts` | L204-L225 | Added progress event assertions to the execute-close path. | Prove stage progress does not change finalize semantics. | `ev:T-0464:51c58e7d001d42b8b4b009c2` |
| `dist/` | N/A | Refreshed built CLI from Docker build output. | Keep workspace CLI current for smoke validation. | `ev:T-0464:c3125378748d4fb79980cfe1` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This adds stage progress lines but does not optimize the underlying mounted-workspace close/audit latency. | Open | T-0463 diagnostics showed finalize execute can still take more than 100 seconds. |
