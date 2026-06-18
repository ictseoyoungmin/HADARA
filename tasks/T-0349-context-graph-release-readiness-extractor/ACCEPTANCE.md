# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `extractReleaseReadiness()` emits `ReleaseCheck` nodes from `docs/RELEASE_READINESS.md` level-2 headings. | Done | `src/context/release-extractors.ts`; `tests/unit/context-graph-release-extractors.test.ts`; `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
| AC-2 | Release-readiness extraction emits document ownership, explicit command, optional evidence dependency edges, and a `release-readiness` state source. | Done | Focused tests cover `BELONGS_TO_DOCUMENT`, `CHECKS_COMMAND`, `DEPENDS_ON_EVIDENCE`, and `state-source:release-readiness`; `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
| AC-3 | Missing `docs/RELEASE_READINESS.md` degrades with a context graph issue instead of throwing. | Done | Missing-source regression in `tests/unit/context-graph-release-extractors.test.ts`; `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
| AC-4 | Focused/full Docker validation passed and evidence is attached. | Done | Docker focused context graph tests passed 7 files / 23 tests; Docker `npm run check` passed 126 files / 814 tests; `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
| AC-5 | Handoff and shared state route the next C1 capsule. | Done | HANDOFF.md, docs/PROJECT_STATE.md, docs/AGENT_HANDOFF.md, docs/DEVELOPMENT_SLICES.md updated. |
