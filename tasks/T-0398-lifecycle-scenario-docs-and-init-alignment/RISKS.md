# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docs make `task finalize` sound like a replacement for explicit lifecycle commands. | Agents may skip proof review or close-source preparation. | Medium | Wording says explicit commands remain canonical and finalize is reviewed/guarded convenience. | Mitigated |
| Generated init guidance drifts from root docs. | Fresh projects get stale lifecycle instructions. | Medium | `src/cli/init.ts` generated content was updated and init/workflow tests passed. | Mitigated |
| Accidental `init` invocation can mutate the current workspace during docs work. | Could introduce unrelated generated-doc churn. | Low | Diff was inspected after the accidental command; only intended T-0398 changes remained. Future init smoke should use an isolated temp project. | Mitigated |
