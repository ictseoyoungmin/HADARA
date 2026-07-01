# T-0460 Consider a small CLI global-option parsing capsule

## Identity

| Field | Value |
|---|---|
| ID | T-0460 |
| Title | Consider a small CLI global-option parsing capsule |
| Status | Done |
| Created | 2026-07-01 |
| Updated | 2026-07-01 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/AGENT_HANDOFF.md | reference | normative | approved | sha256:d401473aa1a582d59000df7d2d89387b373136e6859added21998fb469267dd6 | Routes this capsule from the T-0459 follow-up and T-0460 handoff update. |
| docs/TASK_WORKFLOW_COMMANDS.md | reference | normative | approved | sha256:e373b6578085e8f06dc117458600f525615360e3c397507c2fae00b5ddb4a32d | Defines status-first task workflow and evidence rules. |
| docs/CLI_JSON_CONTRACT.md | constraint | normative | approved | sha256:024e4c4fef9f8da30c8f8e2a5eb15c50ccc767929882b31a54a61b3fa20cb8ae | Defines early CLI parse/global failure behavior. |
| docs/ARCHITECTURE.md | reference | normative | approved | sha256:fbb9ef3d58f34fcb89b3c5e1956fac3b9f12a568e6161391463a81de6289d488 | Confirms CLI layer boundary and deferred runtime surfaces. |
| docs/TEST_STRATEGY.md | constraint | normative | approved | sha256:64d7dfc185cce8fe59afde834db6551efbb19b6172cdae3e3b7ac54d0c6d57d8 | Defines Docker/focused validation expectations. |
| src/cli/main.ts | implementation-source | implementation-source | implemented | sha256:49bd1085d66d539ede0f5b80271783a0bafdd45764b83901e5fdfd54b18fbd1f | CLI entry point now normalizes known leading global options before dispatch. |
| src/cli/args.ts | implementation-source | implementation-source | approved | sha256:968e5bb9f8fc94f5f5e3207c6a66efcc756ee51c8e74dddd88748d45c4ba0e38 | Existing strict option helper behavior was preserved. |
| tests/unit/args.test.ts | implementation-source | implementation-source | implemented | sha256:5f72b39f8b24596b1f597209e596ec83b8ec6814295432f8c40e1ff72b648c2d | Focused unit coverage now includes global option normalization. |

## Goal

| Goal | Notes |
|---|---|
| Support command-independent global option placement for CLI dispatch. | `hadara --project <path> init --json` and `hadara --json task status` should route to the same handlers as command-first forms without changing command-specific option parsing. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | This TASK.md update. |
| 2 | Normalize leading global options before CLI command dispatch. | Done | ev:T-0460:708e920cff184178b4a650d5 |
| 3 | Add focused unit coverage for global option normalization. | Done | ev:T-0460:708e920cff184178b4a650d5 |
| 4 | Run focused validation and built CLI smokes, then record evidence. | Done | ev:T-0460:708e920cff184178b4a650d5, ev:T-0460:4951e6416ffc4c0bad478427 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Leading `--project <path>` is normalized before dispatch so `hadara --project <path> init --json` reaches the init handler. | Yes | Met | ev:T-0460:4951e6416ffc4c0bad478427 | Required | src/cli/main.ts |
| AC-2 | Leading `--json` is normalized before dispatch so JSON-capable commands can be invoked as `hadara --json <command> ...`. | Yes | Met | ev:T-0460:4951e6416ffc4c0bad478427 | Required | src/cli/main.ts |
| AC-3 | Existing command-first invocations and strict option-value validation remain compatible. | Yes | Met | ev:T-0460:708e920cff184178b4a650d5 | Required | tests/unit/args.test.ts |
| AC-4 | Validation evidence is recorded through the canonical evidence writer. | Yes | Met | ev:T-0460:708e920cff184178b4a650d5, ev:T-0460:4951e6416ffc4c0bad478427 | Required | tasks/T-0460-consider-a-small-cli-global-option-parsing-capsule/evidence.jsonl |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused argument tests | `npm run test:focused -- tests/unit/args.test.ts` in Docker `/tmp/hadara` copy | Yes | Passed | ev:T-0460:708e920cff184178b4a650d5 |
| TypeScript build | `npm run build` in Docker `/tmp/hadara` copy | Yes | Passed | ev:T-0460:708e920cff184178b4a650d5 |
| Built CLI global option smokes | `node dist/cli/main.js --project /tmp/hadara-t0460-global-init init --profile basic --json` and `node dist/cli/main.js --json --project . version` | Yes | Passed | ev:T-0460:4951e6416ffc4c0bad478427 |
| Done-level capsule validation | `node dist/cli/main.js harness validate --task T-0460 --level done --json` | Yes | Not Run | Lifecycle finish/finalize pending. |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/cli/main.ts | L7-L25 | Updated | Added `normalizeGlobalArgs` and dispatch through normalized args. | ev:T-0460:708e920cff184178b4a650d5 |
| tests/unit/args.test.ts | L8-L62 | Updated | Added focused coverage for command-independent global option placement. | ev:T-0460:708e920cff184178b4a650d5 |
| dist/cli/main.js | L1-L999 | Updated | Refreshed built CLI output from Docker build. | ev:T-0460:708e920cff184178b4a650d5 |
| tasks/T-0460-consider-a-small-cli-global-option-parsing-capsule/TASK.md | L1-L71 | Updated | Defined and completed the task contract. | ev:T-0460:708e920cff184178b4a650d5 |
| tasks/T-0460-consider-a-small-cli-global-option-parsing-capsule/EVIDENCE.md | L1-L23 | Generated | Evidence projection refreshed from canonical `evidence.jsonl`. | ev:T-0460:708e920cff184178b4a650d5 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Risk | Normalization is intentionally limited to known global options; broader command-specific option reordering remains out of scope. | Accepted | src/cli/main.ts |
