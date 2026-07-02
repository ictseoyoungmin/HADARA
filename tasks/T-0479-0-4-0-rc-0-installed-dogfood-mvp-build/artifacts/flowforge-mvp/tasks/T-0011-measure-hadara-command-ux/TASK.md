# T-0011 Measure HADARA command UX

## Identity

| Field | Value |
|---|---|
| ID | T-0011 |
| Title | Measure HADARA command UX |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| hadara-command-metrics.jsonl | implementation-source | approved | implemented | sha256:6c861cbe012e8247fa55940b271bddd75011bc704555c222f196cf24e8d42b4f | FlowForge artifact source for Measure HADARA command UX. |
| reports/HADARA_DOGFOOD_REPORT.md | implementation-source | approved | implemented | sha256:92e35a3078dd1b16ae92d8e786156fec6cb6c43d712ba603b125219e2c0c1a25 | FlowForge artifact source for Measure HADARA command UX. |

## Goal

| Goal | Notes |
|---|---|
| Complete the FlowForge slice: Measure HADARA command UX. | This capsule is part of the installed `hadara@0.4.0-rc.0` dogfood artifact, not HADARA-dev product source. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the slice contract. | Done | `hadara-command-metrics.jsonl`, `reports/HADARA_DOGFOOD_REPORT.md` |
| 2 | Implement the slice in the FlowForge MVP. | Done | Measured HADARA command timings, output length, and per-capsule command time. |
| 3 | Record dogfood evidence and validation. | Done | ev:T-0011:c69d828846b1480f983fc65a |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | The FlowForge slice is represented by concrete project files. | Yes | Met | `hadara-command-metrics.jsonl`, `reports/HADARA_DOGFOOD_REPORT.md` | Required | Dogfood request |
| AC-2 | Implementation evidence exists for this capsule. | Yes | Met | ev:T-0011:c69d828846b1480f983fc65a | Required | Dogfood request |
| AC-3 | The final MVP smoke test covers the integrated slice. | Yes | Met | `npm run smoke` passed in T-0479 artifact validation. | Required | T-0479 |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Slice evidence | HADARA evidence recorded during FlowForge generation. | Yes | Passed | ev:T-0011:c69d828846b1480f983fc65a |
| Integrated smoke | `npm run smoke` from FlowForge MVP. | Yes | Passed | T-0479 evidence |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| hadara-command-metrics.jsonl<br>reports/HADARA_DOGFOOD_REPORT.md | metrics | Measured HADARA command timings, output length, and per-capsule command time. | Complete this dogfood capsule's MVP scope. | ev:T-0011:c69d828846b1480f983fc65a |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | This is a preserved dogfood artifact rather than live HADARA-dev product code. | Accepted | T-0479 |
