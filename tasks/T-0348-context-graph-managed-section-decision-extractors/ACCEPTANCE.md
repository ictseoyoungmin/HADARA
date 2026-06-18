# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `extractManagedSections()` emits ManagedSection nodes and document ownership edges from managed markers. | Done | `src/context/document-extractors.ts`; `tests/unit/context-graph-document-extractors.test.ts`; `ev:T-0348:7bfdb4f1005e4c23b9d6ad03`. |
| AC-2 | `extractDecisions()` emits Decision nodes from project heading-style and task table-style decision docs. | Done | Focused project/task decision regression; `ev:T-0348:7bfdb4f1005e4c23b9d6ad03`. |
| AC-3 | `extractAgentHandoff()` emits KnownProblem nodes and handoff relationship edges from `docs/AGENT_HANDOFF.md`. | Done | Focused known-problem regression; `ev:T-0348:7bfdb4f1005e4c23b9d6ad03`. |
| AC-4 | Scope remains read-only extractor work: no public CLI surface, graph builder, release extractor, or state projection alignment added. | Done | Source diff is limited to document extractors, tests, capsule docs, and shared state docs. |
| AC-5 | Focused/full validation passed and evidence is attached. | Done | Docker focused tests passed 6 files / 20 tests; Docker `npm run check` passed 125 files / 811 tests; `ev:T-0348:7bfdb4f1005e4c23b9d6ad03`. |
