# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a new `08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md` instead of replacing `07_C6...`. | Accepted | The existing 07 spec is still useful as the broad implementation record; 08 can be shorter, execution-focused, and speed-first. | New spec file and cross-links. |
| D-2 | Adapt Graphify changed-file, portable-manifest, local-code-extraction, and query-first lessons without adopting committed graph output or model-assisted extraction. | Accepted | HADARA cache must remain deterministic, local, ignored, rebuildable, and non-authoritative. | Graphify Reference section. |
| D-3 | Route future C6 work toward code-index shards, graph-core reuse, context-pack warm path, and performance fixtures. | Accepted | T-0368 left code-index shard persistence as the major remaining cache gap; user explicitly emphasized speed. | Implementation Sequence section. |
