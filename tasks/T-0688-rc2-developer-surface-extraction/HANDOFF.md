# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0688 |
| Title | RC2 Developer Surface Extraction |
| Status | Done |
| Created | 2026-07-23T20:04 |
| Updated | 2026-07-23T20:28 |

## Last Completed

| Item | Evidence |
|---|---|
| Public CLI no longer routes or advertises repo-local `debt`, `dev`, `release`, `smoke`, or `package recycle`; release helpers and active docs now use `tools/dev-surfaces.ts`; focused build/tests/diff-check passed. | `ev:T-0688:d64c7d8b3b424db685afd22a`, `ev:T-0688:1e1a2ad2719f410c91b95c80`, `ev:T-0688:0165374b71f54fd58854a11f` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Audit remaining dashboard/TUI and MCP debt/readiness couplings before deleting deeper services. | actionable | Yes | T-0688 removed public CLI exposure first; dashboard/TUI debt routes, MCP debt tools, and release/smoke schemas still exist as HADARA-dev internals. | `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md`, `tasks/T-0688-rc2-developer-surface-extraction/TASK.md`, `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Installed/package consumers no longer have public `hadara release|smoke|package recycle|debt|dev` routing. | Old docs or scripts that still call those public roots will drift or fail. | Use `node --import tsx tools/dev-surfaces.ts ...` or `npm run dev:surface -- ...` from the source checkout. |
| Release/readiness services remain in the repo. | Future deletion work can break dashboard/TUI or MCP debt/readiness reads if it ignores those consumers. | Follow the remaining couplings recorded in T-0687/T-0688 before removing service modules or schemas. |
