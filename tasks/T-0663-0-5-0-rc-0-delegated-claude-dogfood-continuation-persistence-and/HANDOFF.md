# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0663 |
| Title | 0.5.0-rc.0 delegated Claude dogfood: continuation persistence and adoption-baseline nextWork retirement |
| Status | Done |
| Created | 2026-07-20T18:37 |
| Updated | 2026-07-20T18:40 |
## Last Completed

| Item | Evidence |
|---|---|
| Delegated a two-session, three-capsule real feature dogfood (driftlog: a stdlib-only Python habit/streak tracker) to two independently-started Claude subagents, deliberately testing cold-start persistence. Found and classified F-1 (stale global `hadara` shadowed the intended candidate), F-2 (`hasBootstrapNextWork` doesn't recognize the adoption-baseline bootstrap phrase, so `nextWork` gets permanently stuck once its one retirement chance is missed), F-3 (continuation is fully shadowed by any existing recommendation, even a stale review-only one — a gap in T-0661's own precedence work), F-4 (informational, cross-version HANDOFF template drift). | ev:T-0663:be062fced01e42739aafe693, ev:T-0663:1f58adf7d7c0409599ef33b4, ev:T-0663:48ea8a8b50f84dd793c26ade |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Fix F-2: recognize "establish hadara adoption baseline" in `isBootstrapFirstTaskNextWork` (or generalize `hasBootstrapNextWork`), then re-check whether F-3 still reproduces once the stale-nextWork trigger is removed. | F-2 is root-caused and reproduced independently outside `driftlog`; fixing it likely also resolves F-3 without needing new precedence logic. | `DOGFOOD_REPORT.md` F-2/F-3, `src/services/project-current-state.ts`, `src/init/adoption.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
