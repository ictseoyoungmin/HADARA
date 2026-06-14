# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Local or global `hadara` may point to an older package than the just-published rc.2 package. | False-negative or false-positive recycle results. | Medium | Use `npx hadara@0.3.0-rc.2` and temp-prefix installed bin paths for package smokes. | Mitigated |
| npm registry/network access can fail inside the sandbox. | Registry verification may stall or fail for environmental reasons. | Medium | Record the sandbox `EAI_AGAIN` and rerun registry checks through the approved network path. | Mitigated |
| Broad self-migration could introduce unrelated source changes. | T-0312 would exceed post-publish recycle scope. | Medium | Record missing registry artifacts as a follow-up instead of executing a multi-file self-migration. | Mitigated |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
