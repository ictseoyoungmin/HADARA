# T-0003 Build HTTP API and static server

## Identity

| Field | Value |
|---|---|
| ID | T-0003 |
| Title | Build HTTP API and static server |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| src/server.js | implementation-source | approved | implemented | sha256:b5068f503891bce3b69509d561c7f700ab04bc471788e9492e9753adb553e902 | FlowForge artifact source for Build HTTP API and static server. |
| src/store.js | implementation-source | approved | implemented | sha256:e2ddf25146cc8d34f681531a567f5ce060e11d1d8e8b71d4418f408eb0399da6 | FlowForge artifact source for Build HTTP API and static server. |

## Goal

| Goal | Notes |
|---|---|
| Complete the FlowForge slice: Build HTTP API and static server. | This capsule is part of the installed `hadara@0.4.0-rc.0` dogfood artifact, not HADARA-dev product source. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the slice contract. | Done | `src/server.js`, `src/store.js` |
| 2 | Implement the slice in the FlowForge MVP. | Done | Built the REST API and static asset server. |
| 3 | Record dogfood evidence and validation. | Done | ev:T-0003:a407a13ae57f471da72b4073 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | The FlowForge slice is represented by concrete project files. | Yes | Met | `src/server.js`, `src/store.js` | Required | Dogfood request |
| AC-2 | Implementation evidence exists for this capsule. | Yes | Met | ev:T-0003:a407a13ae57f471da72b4073 | Required | Dogfood request |
| AC-3 | The final MVP smoke test covers the integrated slice. | Yes | Met | `npm run smoke` passed in T-0479 artifact validation. | Required | T-0479 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Slice evidence | HADARA evidence recorded during FlowForge generation. | Yes | Passed | ev:T-0003:a407a13ae57f471da72b4073 |
| Integrated smoke | `npm run smoke` from FlowForge MVP. | Yes | Passed | T-0479 evidence |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| src/server.js<br>src/store.js | server | Built the REST API and static asset server. | Complete this dogfood capsule's MVP scope. | ev:T-0003:a407a13ae57f471da72b4073 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is a preserved dogfood artifact rather than live HADARA-dev product code. | Accepted | T-0479 |
