# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Consumers may still use the compatibility `suggestedMarkdown` field. | Removing it would break existing consumers. | Medium | Preserve `suggestedMarkdown` as an alias of `suggestedReplacementMarkdown`. | Mitigated |
| Operators could mistake suggestions for an automatic patch. | Shared-doc mutation could bypass coordinator review. | Low | Keep report `readOnly:true`, `writeBoundary:shared-doc`, coordinator role metadata, and execute refusal. | Mitigated |
| Exact before-hash can become stale after handoff edits. | Coordinator may apply a stale fragment. | Medium | Repeat exact `targetBeforeHash` on every fragment and preview block. | Mitigated |
