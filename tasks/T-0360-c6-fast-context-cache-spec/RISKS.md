# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Over-specifying cache commands could accidentally weaken read-only command boundaries. | Future implementation might make `context graph` mutate files. | Medium | Spec requires read commands to read cache only and puts cache writes behind explicit warm/write surfaces. | Mitigated |
| Cold-build targets may be too aggressive on mounted filesystems. | Future validation could miss real-world `/mnt/f` latency. | Medium | Spec separates hard targets from measurement requirements and requires degraded output plus mounted-workspace smoke coverage. | Mitigated |
| Graphify ideas copied too literally could introduce committed graph artifacts or model-based extraction. | HADARA cache/source-of-truth and privacy boundaries would be violated. | Low | Spec explicitly adapts only manifest/update/query ideas and rejects committed cache, HTML/wiki output, and model extraction for C6. | Mitigated |
| Registry/manual docs updates can drift from generated docs-registry behavior. | Docs doctor may report registry inconsistencies. | Low | Keep entries shaped like existing 0.3.3 spec entries and run docs validation. | Mitigated |
