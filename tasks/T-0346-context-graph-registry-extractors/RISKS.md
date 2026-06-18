# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Command registry source file may be absent in installed-package or source-limited contexts. | Extractor cannot compute a file hash for `src/services/capability-registry.ts`. | Medium | Emit `CONTEXT_GRAPH_COMMAND_REGISTRY_MISSING` while still extracting runtime command registry nodes and doc edges. | Accepted |
| Docs supersession metadata can describe the same relationship from both `supersedes` and `supersededBy`. | Raw extraction may contain duplicate logical edges before graph assembly. | Medium | Edge ids are deterministic; graph builder/merge work should dedupe identical edge ids. | Carry Forward |
| No context graph builder or CLI surface exists yet. | Extractors are not user-facing until a later capsule composes them. | High | Keep this capsule source-specific and continue with evidence/managed-section/release extractors before the graph builder and projection alignment capsules. | Carry Forward |
