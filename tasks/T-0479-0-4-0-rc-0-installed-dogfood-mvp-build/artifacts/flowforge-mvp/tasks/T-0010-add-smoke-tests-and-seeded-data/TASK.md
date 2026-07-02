# T-0010 Add smoke tests and seeded data

## Identity

| Field | Value |
|---|---|
| ID | T-0010 |
| Title | Add smoke tests and seeded data |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| test/smoke.js | implementation-source | approved | implemented | sha256:3183e76405eed64ea048c78575094e35780f70af5281c92ca28564d4b60f450f | FlowForge artifact source for Add smoke tests and seeded data. |
| src/schema.js | implementation-source | approved | implemented | sha256:a1ab8cc5c05bc16cde7c77fb6706bef2fd9d295c17e7183abb6ecbc4132c9003 | FlowForge artifact source for Add smoke tests and seeded data. |
| data/flowforge.json | implementation-source | approved | implemented | sha256:dda4fd72ab1db3935ec12fc3d8b5bf70b51f7dd4553869bc866a0142565cd0db | FlowForge artifact source for Add smoke tests and seeded data. |

## Goal

| Goal | Notes |
|---|---|
| Complete the FlowForge slice: Add smoke tests and seeded data. | This capsule is part of the installed `hadara@0.4.0-rc.0` dogfood artifact, not HADARA-dev product source. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the slice contract. | Done | `test/smoke.js`, `src/schema.js`, `data/flowforge.json` |
| 2 | Implement the slice in the FlowForge MVP. | Done | Added seeded data and end-to-end HTTP smoke test. |
| 3 | Record dogfood evidence and validation. | Done | ev:T-0010:9904947561f0495bad7d6815 |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | The FlowForge slice is represented by concrete project files. | Yes | Met | `test/smoke.js`, `src/schema.js`, `data/flowforge.json` | Required | Dogfood request |
| AC-2 | Implementation evidence exists for this capsule. | Yes | Met | ev:T-0010:9904947561f0495bad7d6815 | Required | Dogfood request |
| AC-3 | The final MVP smoke test covers the integrated slice. | Yes | Met | `npm run smoke` passed in T-0479 artifact validation. | Required | T-0479 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Slice evidence | HADARA evidence recorded during FlowForge generation. | Yes | Passed | ev:T-0010:9904947561f0495bad7d6815 |
| Integrated smoke | `npm run smoke` from FlowForge MVP. | Yes | Passed | T-0479 evidence |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| test/smoke.js<br>src/schema.js<br>data/flowforge.json | smoke tests | Added seeded data and end-to-end HTTP smoke test. | Complete this dogfood capsule's MVP scope. | ev:T-0010:9904947561f0495bad7d6815 |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is a preserved dogfood artifact rather than live HADARA-dev product code. | Accepted | T-0479 |
