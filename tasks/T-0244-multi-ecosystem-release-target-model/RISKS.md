# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Operators may read Python preview as Python release support. | Misleading release readiness claims. | Medium | Docs and descriptor notes state no Python build, pip smoke, twine check, credential loading, or PyPI publish. | Mitigated in design |
| Adding descriptors could break existing release dry-run consumers. | Downstream tools may expect old fields. | Medium | Keep `primary`, `secondary`, and `dockerImage` compatibility fields and add descriptors additively. | Mitigated in implementation |
| Renaming package smoke wholesale could invalidate historical release evidence. | Strict release proof could drift. | Low | Keep existing `package-smoke` evidence category and add npm provider metadata only to new reports. | Mitigated in implementation |
| Future providers may copy npm behavior without security review. | Unplanned registry or filesystem mutation. | Medium | Docs require future provider capsules and preserve no-mutation-by-default release boundaries. | Mitigated in docs |
