# T-0472 Legacy sidecar reference audit

## Identity

| Field | Value |
|---|---|
| ID | T-0472 |
| Title | Legacy sidecar reference audit |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/services/release-closeout.ts | implementation-source | implementation-source | implemented | sha256:cf9da1569e28f9186ecf48fb31e5846c0e7c968c4de749376281a7e38754c9a4 | Release closeout capsule surface list. |
| src/services/state-projection.ts | implementation-source | implementation-source | implemented | sha256:5800b2050eb4ab4fbeb61e882ca1e7c1e5f549fb09b20f4ee4c1ab5198d17907 | State projection plan drift source. |
| src/harness/validate.ts | implementation-source | implementation-source | implemented | sha256:531a97a94ee040efebe10d9f3217487130d6af7870838f14a2cfb455c7ed9497 | Done-level plan/acceptance validation guidance. |
| src/services/operational-debt.ts | implementation-source | implementation-source | implemented | sha256:a134b2ac9df1fb46cb684777188e27cc71817ea9c9795f8f8a5abda2a2f381d5 | Premature acceptance debt detection. |
| src/services/evidence-lint.ts | implementation-source | implementation-source | implemented | sha256:790c557f0f7a942941d5077ac2df62d70e4adf429f45613746ae5d71f05e4f57 | Evidence semantic documentation sources. |
| src/tui/constants.ts | implementation-source | implementation-source | implemented | sha256:c7e67092093928ae792ed7cea60f93afd008eb8f6bc11dc46603b3850298be8b | TUI document tab order. |
| src/tui/read-model.ts | implementation-source | implementation-source | implemented | sha256:b25d2a5d8e2306eeb57a7d75c34947863029409e3036333eb06772b59cbf201f | TUI task document read order. |
| src/tui/snapshot.ts | implementation-source | implementation-source | implemented | sha256:7edc5302ccaa7534415d7a28ef25cb227f3f909fbf97f166843ae1db3a9f19be | TUI task section fallback summary. |
| tests/unit/release-closeout.test.ts | implementation-source | implementation-source | implemented | sha256:e94326a188736c86c3e90cd04d0a3bf1b4e548e60d70104121fddf055e1cbcf7 | Release closeout regression fixture. |
| tests/unit/state-projection.test.ts | implementation-source | implementation-source | implemented | sha256:8b5138f47c2ffe3d878b6afcbe579feb2f404bd6ae37747ca1041dbcba6694fb | State projection current/legacy plan fixtures. |
| tests/unit/operational-debt.test.ts | implementation-source | implementation-source | implemented | sha256:d6b551504702226a002e20cf26cd16e13d94c87ae19ffffd958f59e9098dcb24 | Operational debt current TASK acceptance fixture. |
| tests/unit/evidence-lint.test.ts | implementation-source | implementation-source | implemented | sha256:ad634cf07f52c6a98c09ac5e14ef3c74b9a3e90f151ab641ab1b03182228d71f | Evidence semantic TASK risk fixture. |
| tests/unit/tui-snapshot.test.ts | implementation-source | implementation-source | implemented | sha256:74dc17cdf7e6a893ca0fcbee5dc0eab2f327e8e349ea728d556e7a9530e0f38b | TUI current-first tab expectation. |

## Goal

| Goal | Notes |
|---|---|
| Audit and reduce user-facing legacy Task Capsule sidecar assumptions outside protocol consistency. | Keep legacy sidecars readable where present, but make current 0.4 `TASK.md` sections the default for release closeout, state/debt/evidence diagnostics, and TUI summaries. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract and source surface. | Done | This TASK.md |
| 2 | Make diagnostics use current TASK.md sections when legacy sidecars are absent. | Done | ev:T-0472:464654f09f824d09ad4e6a4e |
| 3 | Keep legacy sidecar compatibility where old capsules still have those files. | Done | ev:T-0472:ddf2c1f180054178b95a26a1 |
| 4 | Validate focused read-model/diagnostic/TUI suites and refresh dist. | Done | ev:T-0472:758500c96600471bb12c7bb8 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Release closeout no longer treats removed default `ACCEPTANCE.md` and `TESTS.md` sidecars as current capsule surfaces. | Yes | Met | ev:T-0472:464654f09f824d09ad4e6a4e | Required | src/services/release-closeout.ts |
| AC-2 | State projection and harness Done-level plan drift checks use current `TASK.md` Plan when `PLAN.md` is absent. | Yes | Met | ev:T-0472:464654f09f824d09ad4e6a4e | Required | src/services/state-projection.ts |
| AC-3 | Operational debt and evidence semantic lint use current `TASK.md` Acceptance/Risks sections when sidecars are absent. | Yes | Met | ev:T-0472:464654f09f824d09ad4e6a4e | Required | src/services/operational-debt.ts |
| AC-4 | TUI current capsule read order favors TASK/EVIDENCE/HANDOFF while preserving legacy sidecar access. | Yes | Met | ev:T-0472:ddf2c1f180054178b95a26a1 | Required | src/tui/constants.ts |
| AC-5 | Focused regression suites pass and workspace `dist` is refreshed. | Yes | Met | ev:T-0472:758500c96600471bb12c7bb8 | Required | ev:T-0472:abb18b6756a440a89fc68fd6 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused service tests | `npx vitest run tests/unit/release-closeout.test.ts tests/unit/state-projection.test.ts tests/unit/operational-debt.test.ts tests/unit/evidence-lint.test.ts` | Yes | Passed | ev:T-0472:464654f09f824d09ad4e6a4e |
| Harness/TUI regression tests | `npx vitest run tests/harness/harness-validate.test.ts tests/unit/tui-state.test.ts tests/unit/tui-snapshot.test.ts` | Yes | Passed | ev:T-0472:ddf2c1f180054178b95a26a1 |
| Build / dist refresh | `npm run build && cp -a /tmp/hadara/dist/. /workspace/dist/` in Docker | Yes | Passed | ev:T-0472:758500c96600471bb12c7bb8 |
| Built CLI release closeout smoke | `node dist/cli/main.js release closeout --version 0.3.4 --task T-0472 --json` | Yes | Passed | ev:T-0472:abb18b6756a440a89fc68fd6 |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/release-closeout.ts | module:release closeout surfaces | Reduce task capsule release closeout surfaces to current `TASK.md`, `EVIDENCE.md`, and `HANDOFF.md`. | Removed default sidecars should not appear missing/stale for current capsules. | ev:T-0472:464654f09f824d09ad4e6a4e |
| src/services/state-projection.ts | function:buildTaskProjection | Use legacy `PLAN.md` when present, otherwise read current `TASK.md` Plan for drift projection. | Current 0.4 capsules store plan rows in TASK.md. | ev:T-0472:464654f09f824d09ad4e6a4e |
| src/harness/validate.ts | function:validatePlanStatusDrift | Use `TASK.md` Plan fallback for Done-level plan drift and keep current acceptance guidance. | Prevent current capsules from bypassing plan drift checks. | ev:T-0472:ddf2c1f180054178b95a26a1 |
| src/services/operational-debt.ts | function:detectPrematureAcceptance | Use current `TASK.md` Acceptance fallback and shared acceptance parser. | Detect premature accepted criteria in current capsules. | ev:T-0472:464654f09f824d09ad4e6a4e |
| src/services/evidence-lint.ts | function:readTaskDocs | Use current `TASK.md` Acceptance and Risks / Follow-ups sections as semantic documentation fallback. | Failed/blocked evidence residuals can now be explained in current capsules without sidecars. | ev:T-0472:464654f09f824d09ad4e6a4e |
| src/tui/constants.ts, src/tui/read-model.ts, src/tui/snapshot.ts | module:TUI task detail | Put current capsule files first and use TASK.md Plan/Acceptance fallback in overview summaries. | TUI should favor current 0.4 capsules while retaining legacy sidecar access. | ev:T-0472:ddf2c1f180054178b95a26a1 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Legacy sidecar references remain intentionally in historical specs/tests, compatibility fixtures, task template/upgrade migration paths, write-preflight compatibility lists, and old project SOP docs. | Open | Source scan |
