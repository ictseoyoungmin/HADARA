# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat `lineEnd === lineStart` on context-pack items as an anchor, not a complete explicit range, when building slice candidates. | Accepted | Graph nodes often point at one source line such as a heading; using that as the whole raw slice produced unusable one-line context. | `ev:T-0390:d6ab0cb842d3479faf06b351` |
| D-2 | Preserve real ranges when metadata or item `lineEnd` is greater than `lineStart`. | Accepted | Source fidelity should win when extractors provide a meaningful span. | `ev:T-0390:d6ab0cb842d3479faf06b351` |
| D-3 | Use a bounded 80-line default candidate window rather than changing the context slice resolver. | Accepted | The resolver should execute source-addressed candidate metadata; the candidate producer is responsible for making useful bounded suggestions. | `ev:T-0390:3696103d7d274411b7cc706f` |
