# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Atomic rename failure could leave a temp file or corrupt the target. | Managed docs patch execute would be less trustworthy on mounted filesystems. | Low after change. | Regression mocks `renameSync` failure and checks original target plus temp cleanup. | Mitigated |
| Report consumers might treat the new write-failure issue as unexpected. | Low; issues are the existing extension point. | Low. | Preserve schema id and add an ordinary error issue only on failed execute. | Mitigated |
| Full validation contention test can be timing-sensitive. | Full check may occasionally fail under worker contention. | Medium. | Reran focused evidence contention test and full suite; both passed. | Mitigated |
