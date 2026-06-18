# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Project State and Agent Handoff extractors emit state sources for latest/active task hints. | Done | `src/context/document-extractors.ts`; `tests/unit/context-graph-document-extractors.test.ts`; `ev:T-0350:b540a670f64b48babe233d22`. |
| AC-2 | Compact C1 state projection builds `ContextStateProjectionReport` from extractor outputs without replacing existing Phase 8 `state verify`. | Done | `src/context/state-projection.ts`; `tests/unit/context-state-projection.test.ts`; existing `tests/unit/state-projection.test.ts`; `ev:T-0350:b540a670f64b48babe233d22`. |
| AC-3 | Latest-task, active-task, missing-row/capsule, close-proof, release-source, and extraction-warning diagnostics are covered. | Done | `tests/unit/context-state-projection.test.ts`; `ev:T-0350:b540a670f64b48babe233d22`. |
| AC-4 | Focused/full Docker validation passed and evidence is attached. | Done | Docker focused tests passed 5 files / 19 tests; Docker `npm run check` passed 127 files / 818 tests; `ev:T-0350:b540a670f64b48babe233d22`. |
| AC-5 | Handoff and shared state route the next C1 capsule. | Done | HANDOFF.md, docs/PROJECT_STATE.md, docs/AGENT_HANDOFF.md, docs/DEVELOPMENT_SLICES.md updated. |
