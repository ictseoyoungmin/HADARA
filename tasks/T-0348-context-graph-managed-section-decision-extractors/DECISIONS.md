# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Put managed-section, decision, and known-problem extraction in one document extractor module. | Accepted | They all read Markdown document structure and share document ownership edges. | `src/context/document-extractors.ts`; `ev:T-0348:7bfdb4f1005e4c23b9d6ad03` |
| D-2 | Support both project heading-style and task table-style decision records. | Accepted | HADARA-dev project decisions are historical heading prose, while current Task Capsules use decision tables. | `tests/unit/context-graph-document-extractors.test.ts` |
| D-3 | Keep KnownProblem extraction explicit to Agent Handoff current known problems. | Accepted | This matches the current handoff source of known-problem truth without introducing heuristic text extraction. | `src/context/document-extractors.ts` |
