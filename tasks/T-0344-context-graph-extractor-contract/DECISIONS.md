# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement the extractor contract as pure TypeScript helpers, not a public command or graph builder. | Accepted | The worker plan separates extractor contract from source extractors, graph report builder, and CLI/read surface integration. | `ev:T-0344:567e18dd540c4ea085934770`. |
| D-2 | Keep extractor execution synchronous for the current filesystem-backed C1 sources. | Accepted | Existing HADARA read models are mostly synchronous filesystem projections; async can be introduced later only if source access needs it. | `ev:T-0344:567e18dd540c4ea085934770`. |
| D-3 | Use normalized project-relative paths and normalized reason/text before hashing graph ids. | Accepted | This matches the C1 deterministic ID intent and reduces noisy rebuild drift across platform path separators and Markdown whitespace. | `ev:T-0344:567e18dd540c4ea085934770`. |
