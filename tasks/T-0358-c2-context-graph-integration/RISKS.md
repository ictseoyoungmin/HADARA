# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Code graph output changes default C1 graph shape. | Existing C1 consumers could receive large new node/edge sets unexpectedly. | Medium | Made code graph inclusion opt-in through `includeCode` and tested default output excludes code node types. | Mitigated |
| Code index warnings make context graph appear failed. | Unsupported imports should degrade, not block graph generation. | Medium | Mapped code index issues into graph warnings and preserved `summary.degraded`; built smoke returned `ok:true` with degraded warning state. | Mitigated |
| Code node type mapping diverges from C2 spec. | Agents may not find expected SourceFile/TestFile/FixtureFile/ConfigFile/Symbol nodes. | Low | Used spec-listed node types and stored file kind/language details in metadata. | Mitigated |
