# T-0009 Build import export workflow

## Identity

| Field | Value |
|---|---|
| ID | T-0009 |
| Title | Build import export workflow |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| public/app.js | implementation-source | approved | implemented | sha256:d60cbb8538334e0251894f6f6e5edbd868f25702361104bc6037b158b8ab13aa | FlowForge artifact source for Build import export workflow. |
| src/server.js | implementation-source | approved | implemented | sha256:b5068f503891bce3b69509d561c7f700ab04bc471788e9492e9753adb553e902 | FlowForge artifact source for Build import export workflow. |

## Goal

| Goal | Notes |
|---|---|
| Complete the FlowForge slice: Build import export workflow. | This capsule is part of the installed `hadara@0.4.0-rc.0` dogfood artifact, not HADARA-dev product source. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the slice contract. | Done | `public/app.js`, `src/server.js` |
| 2 | Implement the slice in the FlowForge MVP. | Done | Built JSON export/import API and browser workflow. |
| 3 | Record dogfood evidence and validation. | Done | ev:T-0009:93c805b0a16d47199aea8b63 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | The FlowForge slice is represented by concrete project files. | Yes | Met | `public/app.js`, `src/server.js` | Required | Dogfood request |
| AC-2 | Implementation evidence exists for this capsule. | Yes | Met | ev:T-0009:93c805b0a16d47199aea8b63 | Required | Dogfood request |
| AC-3 | The final MVP smoke test covers the integrated slice. | Yes | Met | `npm run smoke` passed in T-0479 artifact validation. | Required | T-0479 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Slice evidence | HADARA evidence recorded during FlowForge generation. | Yes | Passed | ev:T-0009:93c805b0a16d47199aea8b63 |
| Integrated smoke | `npm run smoke` from FlowForge MVP. | Yes | Passed | T-0479 evidence |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| public/app.js<br>src/server.js | import export | Built JSON export/import API and browser workflow. | Complete this dogfood capsule's MVP scope. | ev:T-0009:93c805b0a16d47199aea8b63 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is a preserved dogfood artifact rather than live HADARA-dev product code. | Accepted | T-0479 |
