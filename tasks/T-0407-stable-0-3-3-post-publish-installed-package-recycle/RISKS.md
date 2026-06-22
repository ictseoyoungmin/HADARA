# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm registry unavailable during recycle | Cannot prove published package behavior. | Medium | Ran registry/install checks with network approval and recorded evidence. | Resolved |
| Source checkout accidentally used instead of installed package | Would not prove user install path. | Low | Smoke invoked `/tmp/.../node_modules/.bin/hadara` from `npm install hadara@latest`. | Resolved |
| Disposable project context warnings misread as recycle failure | Fresh generated project can have degraded graph/state warnings. | Medium | Treated command `ok:true` and expected degraded warnings as acceptable; summary artifact records this. | Mitigated |
| Temporary paths left behind | Local state pollution. | Low | Smoke removed temp prefix/project and verified cleanup. | Resolved |
