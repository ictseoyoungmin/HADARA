# T-0442 T-04A15 Context Pack Read-Map Integration

## Identity

| Field | Value |
|---|---|
| ID | T-0442 |
| Title | T-04A15 Context Pack Read-Map Integration |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/specs/0.4.0/productization-redesign/10_Context_Routing_and_Session_Start_Integration.md | implementation-source | implementation-source | approved | sha256:93cd5da08978ac3054303aa15afbfd16ba2fbb6d337f9cdda716041c6863618f | Defines context pack read-map behavior and excluded docs policy. |
| docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md | implementation-source | implementation-source | approved | sha256:fe90f8ef046cf98fa7acb8e2ae57a27479c44338e10d01fac4f75444d28bc954 | Defines read-map buckets and default reading policy. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | implementation-source | implementation-source | approved | sha256:0b05fc282f6905b5c690306cee2901a333567abb91cde25dcd96f946ca95a0ae | Places this capsule as T-04A15 and excludes release work. |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | reference | implementation-source | approved | sha256:25cb3d44276590ee0e89f8b98ee5116cddc76ec2b129513cedecd6144ca163e9 | Existing context pack contract to preserve. |
| docs/AGENT_HANDOFF.md | reference | normative | approved | sha256:b1ffd6f326baecc1a4e5f19ea47c7612ec46af89fb6596704430696d42365bd6 | Current handoff points next work at T-04A16 after T-0442 completion. |

## Goal

| Goal | Notes |
|---|---|
| Make `hadara context pack --task T-XXXX --json` consume docs read-map policy. | Reuse `docs read-map` rather than reconstructing document policy; include active read-map docs and keep excluded/unregistered docs out of default read buckets. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract and source document hashes. | Done | TASK.md |
| 2 | Wire docs read-map into context pack ranking/filtering. | Done | ev:T-0442:0442975b9ace4166a801f5a6 |
| 3 | Add focused tests for active-spec inclusion and excluded-spec filtering. | Done | ev:T-0442:0442975b9ace4166a801f5a6 |
| 4 | Validate with focused Docker tests, built CLI smoke, harness, and diff hygiene. | Done | ev:T-0442:0442975b9ace4166a801f5a6; ev:T-0442:fb4472fd84544f7ea682ade0; ev:T-0442:135871c73abb418da735fd6b |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Context pack includes docs read-map active task/spec entries even when they are not graph-ranked. | Yes | Met | ev:T-0442:0442975b9ace4166a801f5a6; ev:T-0442:fb4472fd84544f7ea682ade0 | Required | docs/specs/0.4.0/productization-redesign/10_Context_Routing_and_Session_Start_Integration.md |
| AC-2 | Context pack excludes read-map `doNotReadByDefault` paths from `readFirst` and `readIfNeeded`. | Yes | Met | ev:T-0442:0442975b9ace4166a801f5a6; ev:T-0442:fb4472fd84544f7ea682ade0 | Required | docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md |
| AC-3 | Existing context pack contract, slice candidates, and agent actions remain schema-valid. | Yes | Met | ev:T-0442:0442975b9ace4166a801f5a6 | Required | docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md |
| AC-4 | Shared state points the next capsule at T-04A16 after T-0442. | Yes | Met | docs/AGENT_HANDOFF.md; docs/PROJECT_STATE.md; docs/DEVELOPMENT_SLICES.md | Required | docs/AGENT_HANDOFF.md |
| AC-5 | Validation evidence is recorded and the capsule is ready for finalize/audit close proof. | Yes | Met | ev:T-0442:0442975b9ace4166a801f5a6; ev:T-0442:fb4472fd84544f7ea682ade0; ev:T-0442:135871c73abb418da735fd6b; ev:T-0442:197586bb12964b7db5fbd769 | Required | docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Focused Docker tests | `npm run build && npm run test:focused -- tests/unit/context-pack.test.ts tests/unit/docs-registry.test.ts tests/unit/session-start.test.ts` in `hadara-dev` temp copy | Yes | Passed | ev:T-0442:0442975b9ace4166a801f5a6 |
| Built CLI smoke | `hadara context pack --task T-0442 --json` reports read-map docs metadata and excludes unregistered specs from default read buckets. | Yes | Passed | ev:T-0442:0e3a277c413840c3b3aea5bd; ev:T-0442:fb4472fd84544f7ea682ade0 |
| Done-level harness | `hadara harness validate --task T-0442 --level done --json` | Yes | Passed | ev:T-0442:197586bb12964b7db5fbd769 |
| Diff hygiene | `git diff --check` | Yes | Passed | ev:T-0442:135871c73abb418da735fd6b |

## Change Summary

| Path | Lines | Change | Reason | Evidence |
|---|---|---|---|---|
| src/context/context-pack.ts | L16-L392 | Consume docs read-map in context pack ranking/filtering and prioritize active task/spec read-map entries. | Reuse existing docs policy instead of duplicating document selection logic. | ev:T-0442:0442975b9ace4166a801f5a6 |
| tests/unit/context-pack.test.ts | L18-L211 | Cover read-map active-spec inclusion and excluded-spec filtering. | Lock T-04A15 behavior. | ev:T-0442:0442975b9ace4166a801f5a6 |
| .hadara/context/MEMORY.md | L13-L15 | Record dogfood note about active task/spec read-map priority. | Preserve useful HADARA self-development learning. | ev:T-0442:fb4472fd84544f7ea682ade0 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Risk | `docs read-map` can discover many excluded historical specs; context pack should use that policy to filter default reads without making agents inspect those docs. | Open | docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md |
