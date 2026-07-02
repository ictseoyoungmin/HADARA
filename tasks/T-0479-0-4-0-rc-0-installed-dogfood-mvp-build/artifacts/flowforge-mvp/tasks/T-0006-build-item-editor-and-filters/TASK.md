# T-0006 Build item editor and filters

## Identity

| Field | Value |
|---|---|
| ID | T-0006 |
| Title | Build item editor and filters |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| public/app.js | implementation-source | approved | implemented | sha256:d60cbb8538334e0251894f6f6e5edbd868f25702361104bc6037b158b8ab13aa | FlowForge artifact source for Build item editor and filters. |
| public/index.html | implementation-source | approved | implemented | sha256:8f0313e0833325f64313a5b32974e279dfdd6c046955f1a7944374a20e437b55 | FlowForge artifact source for Build item editor and filters. |

## Goal

| Goal | Notes |
|---|---|
| Complete the FlowForge slice: Build item editor and filters. | This capsule is part of the installed `hadara@0.4.0-rc.0` dogfood artifact, not HADARA-dev product source. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the slice contract. | Done | `public/app.js`, `public/index.html` |
| 2 | Implement the slice in the FlowForge MVP. | Done | Built item editor, search, owner/status filters, and persistence wiring. |
| 3 | Record dogfood evidence and validation. | Done | ev:T-0006:149edf3a5336423792b696f0 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | The FlowForge slice is represented by concrete project files. | Yes | Met | `public/app.js`, `public/index.html` | Required | Dogfood request |
| AC-2 | Implementation evidence exists for this capsule. | Yes | Met | ev:T-0006:149edf3a5336423792b696f0 | Required | Dogfood request |
| AC-3 | The final MVP smoke test covers the integrated slice. | Yes | Met | `npm run smoke` passed in T-0479 artifact validation. | Required | T-0479 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Slice evidence | HADARA evidence recorded during FlowForge generation. | Yes | Passed | ev:T-0006:149edf3a5336423792b696f0 |
| Integrated smoke | `npm run smoke` from FlowForge MVP. | Yes | Passed | T-0479 evidence |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| public/app.js<br>public/index.html | editing | Built item editor, search, owner/status filters, and persistence wiring. | Complete this dogfood capsule's MVP scope. | ev:T-0006:149edf3a5336423792b696f0 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is a preserved dogfood artifact rather than live HADARA-dev product code. | Accepted | T-0479 |
