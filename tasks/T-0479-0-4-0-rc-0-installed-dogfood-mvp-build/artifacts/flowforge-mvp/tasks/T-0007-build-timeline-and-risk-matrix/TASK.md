# T-0007 Build timeline and risk matrix

## Identity

| Field | Value |
|---|---|
| ID | T-0007 |
| Title | Build timeline and risk matrix |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| public/app.js | implementation-source | approved | implemented | sha256:d60cbb8538334e0251894f6f6e5edbd868f25702361104bc6037b158b8ab13aa | FlowForge artifact source for Build timeline and risk matrix. |
| src/schema.js | implementation-source | approved | implemented | sha256:a1ab8cc5c05bc16cde7c77fb6706bef2fd9d295c17e7183abb6ecbc4132c9003 | FlowForge artifact source for Build timeline and risk matrix. |
| public/styles.css | implementation-source | approved | implemented | sha256:57b062878627301d601a37e168290ecccb8cfa0d44648258dc0f58bb5e55bf42 | FlowForge artifact source for Build timeline and risk matrix. |

## Goal

| Goal | Notes |
|---|---|
| Complete the FlowForge slice: Build timeline and risk matrix. | This capsule is part of the installed `hadara@0.4.0-rc.0` dogfood artifact, not HADARA-dev product source. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the slice contract. | Done | `public/app.js`, `src/schema.js`, `public/styles.css` |
| 2 | Implement the slice in the FlowForge MVP. | Done | Built timeline view and risk/health derived fields. |
| 3 | Record dogfood evidence and validation. | Done | ev:T-0007:599e78126e0840b099dde5a0 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | The FlowForge slice is represented by concrete project files. | Yes | Met | `public/app.js`, `src/schema.js`, `public/styles.css` | Required | Dogfood request |
| AC-2 | Implementation evidence exists for this capsule. | Yes | Met | ev:T-0007:599e78126e0840b099dde5a0 | Required | Dogfood request |
| AC-3 | The final MVP smoke test covers the integrated slice. | Yes | Met | `npm run smoke` passed in T-0479 artifact validation. | Required | T-0479 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Slice evidence | HADARA evidence recorded during FlowForge generation. | Yes | Passed | ev:T-0007:599e78126e0840b099dde5a0 |
| Integrated smoke | `npm run smoke` from FlowForge MVP. | Yes | Passed | T-0479 evidence |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| public/app.js<br>src/schema.js<br>public/styles.css | timeline risk | Built timeline view and risk/health derived fields. | Complete this dogfood capsule's MVP scope. | ev:T-0007:599e78126e0840b099dde5a0 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is a preserved dogfood artifact rather than live HADARA-dev product code. | Accepted | T-0479 |
