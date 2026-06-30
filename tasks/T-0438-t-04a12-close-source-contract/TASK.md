# T-0438 T-04A12 Close Source Contract

## Identity

| Field | Value |
|---|---|
| ID | T-0438 |
| Title | T-04A12 Close Source Contract |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md | constraint | approved | implemented | sha256:9a1546bbe4e5dcffebc17dd1460cfa8abedb041503092c7b08a0e4c07cc979f9 | Defines `hadara.closeSource.v1` and close-source input boundaries. |
| docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md | constraint | approved | implemented | sha256:740f79ace2b21b293fe312e7cd1498babe6993b9ac9002dee2a5d9ed31db0527 | Defines normalized evidence readiness snapshot behavior. |
| docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md | reference | approved | implemented | sha256:ddce331eebd5a9d5cfd41282275f7e82c49dff632a93c087cbf5d2ca210ab861 | Defines 0.4 JSON diagnostic expectations. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | reference | approved | implemented | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places T-04A12 after close proof placement. |

## Goal

| Goal | Notes |
|---|---|
| Implement the 0.4 close-source read model and use it as the close source hash boundary. | Replace broad raw-file close hashing with normalized source units: `TASK.md`, slot registry, task-board row, evidence readiness snapshot, and handoff summary snapshot. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract. | Done | Source Documents table. |
| 2 | Add `hadara.closeSource.v1` read model and schema. | Done | ev:T-0438:9462d50758aa418c84318576 |
| 3 | Route task close/audit source hash through the close-source payload hash. | Done | ev:T-0438:9462d50758aa418c84318576 |
| 4 | Add CLI/registry/test coverage. | Done | ev:T-0438:9462d50758aa418c84318576 |
| 5 | Validate and record evidence. | Done | ev:T-0438:9462d50758aa418c84318576 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `task close-source --task T-XXXX --json` returns `hadara.closeSource.v1` with normalized source units and a stable payload hash. | Yes | Met | ev:T-0438:9462d50758aa418c84318576 | Required | docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md |
| AC-2 | Close source units exclude raw `EVIDENCE.md`, raw `evidence.jsonl`, raw task-local `HANDOFF.md`, whole `docs/TASK_BOARD.md`, and shared state docs by default. | Yes | Met | ev:T-0438:9462d50758aa418c84318576 | Required | docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md |
| AC-3 | `task close` and `task audit-close` use the close-source payload hash for source hash comparison, while close evidence still carries the normalized evidence readiness snapshot. | Yes | Met | ev:T-0438:9462d50758aa418c84318576 | Required | docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md |
| AC-4 | Focused validation evidence is recorded before finalize. | Yes | Met | ev:T-0438:9462d50758aa418c84318576 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Build | `npm run build` in Docker ext4 workspace copy | Yes | Passed | ev:T-0438:9462d50758aa418c84318576 |
| Focused tests | `npm run test:focused -- tests/unit/task-close-source.test.ts tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/schema-fixtures.test.ts tests/unit/command-registry.test.ts` in Docker ext4 workspace copy | Yes | Passed | ev:T-0438:9462d50758aa418c84318576 |
| Built CLI smoke | `dist/cli/main.js task close-source --task T-0438 --json` and draft harness validation | Yes | Passed | ev:T-0438:9462d50758aa418c84318576 |
| Done validation | `dist/cli/main.js harness validate --task T-0438 --level done --json` | Yes | Passed | ev:T-0438:d07a1913f19044fd81848b57 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0438:d07a1913f19044fd81848b57 |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/task/task-close.ts | L1-L220, L456-L560 | Added `hadara.closeSource.v1` report generation and routed close source hashes through normalized source units. | Implement the 0.4 close-source contract without broad raw-file hashes. | ev:T-0438:9462d50758aa418c84318576 |
| src/cli/task.ts | L1-L119 | Added `task close-source --task T-XXXX --json` routing. | Expose the close-source read model to agents/operators. | ev:T-0438:9462d50758aa418c84318576 |
| src/services/state-projection.ts | L1-L7, L393-L504 | Reused the close-source payload hash for state projection close-proof freshness. | Keep stale-proof diagnostics aligned with the 0.4 source boundary. | ev:T-0438:9462d50758aa418c84318576 |
| src/core/schema.ts, src/schemas/schema-index.json, src/schemas/close-source.schema.json | L1-L141, L1-L15, L1-L32 | Registered `hadara.closeSource.v1`. | Keep structured output discoverable and schema-backed. | ev:T-0438:9462d50758aa418c84318576 |
| src/services/capability-registry.ts | L636-L659 | Registered `task.close-source` command metadata. | Keep command discovery aligned with the new read model. | ev:T-0438:9462d50758aa418c84318576 |
| tests/unit/task-close-source.test.ts, tests/unit/task-close.test.ts, tests/unit/schema-fixtures.test.ts | L1-L138, L249-L372, L23-L24 | Added close-source coverage and aligned close drift fixtures with TASK.md source boundaries. | Prove the normalized source boundary and CLI route. | ev:T-0438:9462d50758aa418c84318576 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Shared-state close-source declarations remain later scope; this capsule keeps the default boundary project-local and task-local. | Deferred | docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md |
