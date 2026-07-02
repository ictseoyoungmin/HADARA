# T-0471 Protocol consistency legacy fixture cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0471 |
| Title | Protocol consistency legacy fixture cleanup |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| tests/unit/protocol-consistency.test.ts | implementation-source | implementation-source | implemented | sha256:6ff1edeeab12f9af16d1e849c10f630090ee3a62ff29ab7ae898b439fe5f3de6 | Legacy fixture failures from broad protocol test. |
| src/services/protocol-consistency.ts | implementation-source | implementation-source | implemented | sha256:7d5a45a57b7e5789b3cc61908b3ef36c9f07b051ce510f5d548319b398d9b317 | Protocol doctor task-level checks. |
| src/harness/validate.ts | implementation-source | implementation-source | implemented | sha256:3585050881289ae72a3836c868f43091740325892941dc6af078f1a9c4b5c3d4 | Done-level validation messages and 0.4 capsule compatibility. |
| src/task/acceptance.ts | reference | implementation-source | implemented | sha256:1e40382130eee06720e9a312c57dc6bfa6460dd364264e2a2c381a43118e586f | Acceptance table parser used by doctor and validate. |
| src/task/task-capsule.ts | reference | implementation-source | implemented | sha256:357ff360052246039f2047e372cd89beab5ba94cac6569dd222049176f68c744 | Current 0.4 Task Capsule scaffold shape. |

## Goal

| Goal | Notes |
|---|---|
| Remove stale legacy sidecar assumptions from protocol consistency fixtures and task-level checks. | Preserve support for legacy sidecars where present, but make current 0.4 `TASK.md` the default source for acceptance and scaffold diagnostics. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | This TASK.md |
| 2 | Update protocol consistency acceptance/scaffold checks for current capsules. | Done | ev:T-0471:f1ba74206a9c4900a0dc68aa |
| 3 | Refresh stale legacy fixtures in protocol consistency tests. | Done | ev:T-0471:f1ba74206a9c4900a0dc68aa |
| 4 | Validate focused suites and refresh built CLI dist. | Done | ev:T-0471:0062866455bb449ebee07c0e |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Protocol doctor reports pending/in-progress acceptance from current 0.4 `TASK.md` capsules. | Yes | Met | ev:T-0471:f1ba74206a9c4900a0dc68aa | Required | src/services/protocol-consistency.ts |
| AC-2 | Protocol consistency unit fixtures no longer depend on removed default `FILES.md` or `ACCEPTANCE.md` files. | Yes | Met | ev:T-0471:f1ba74206a9c4900a0dc68aa | Required | tests/unit/protocol-consistency.test.ts |
| AC-3 | Done-level validation guidance no longer tells current 0.4 users to fill removed default sidecar files. | Yes | Met | ev:T-0471:f7a1d36929d7422fab03d9b9 | Required | src/harness/validate.ts |
| AC-4 | Focused protocol/harness validation passes and built CLI dist is refreshed. | Yes | Met | ev:T-0471:0062866455bb449ebee07c0e | Required | ev:T-0471:c9c0dfa110ec49a98e152ba8 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused protocol consistency tests | `npx vitest run tests/unit/protocol-consistency.test.ts` | Yes | Passed | ev:T-0471:f1ba74206a9c4900a0dc68aa |
| Related harness/task capsule tests | `npx vitest run tests/harness/harness-validate.test.ts tests/unit/task-capsule.test.ts` | Yes | Passed | ev:T-0471:f7a1d36929d7422fab03d9b9 |
| Build / dist refresh | `npm run build && cp -a /tmp/hadara/dist/. /workspace/dist/` in Docker | Yes | Passed | ev:T-0471:0062866455bb449ebee07c0e |
| Built CLI protocol doctor smoke | `node dist/cli/main.js protocol doctor --task T-0471 --json` | Yes | Passed | ev:T-0471:c9c0dfa110ec49a98e152ba8 |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/services/protocol-consistency.ts | function:checkDoneAcceptance | Read `TASK.md` Acceptance when legacy `ACCEPTANCE.md` is absent and report neutral acceptance wording. | Align task protocol doctor with current 0.4 capsules. | ev:T-0471:f1ba74206a9c4900a0dc68aa |
| src/harness/validate.ts | function:validateAcceptanceDone | Update done-level acceptance guidance and TASK.md scaffold examples to current 0.4 table shape. | Remove current-user guidance toward removed default sidecars. | ev:T-0471:f7a1d36929d7422fab03d9b9 |
| tests/unit/protocol-consistency.test.ts | fixtures:task protocol consistency | Replace removed default `FILES.md`/`ACCEPTANCE.md` fixture assumptions with `HANDOFF.md` and `TASK.md` acceptance table edits. | Keep tests aligned with the active scaffold. | ev:T-0471:f1ba74206a9c4900a0dc68aa |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Other surfaces still contain legacy sidecar references, including release closeout, operational debt, task-close compatibility paths, task templates/upgrades, and TUI read models. | Open | Next capsule candidate |
