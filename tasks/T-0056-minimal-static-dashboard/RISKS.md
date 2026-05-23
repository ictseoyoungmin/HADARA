# Risks

| Risk | Mitigation |
|---|---|
| Static dashboard expands into a live app. | Test for forbidden live integration strings and keep scope in capsule docs. |
| Fixture is mistaken for current repository state. | Add `fixtureMeta.notLiveData: true` and visible dashboard provenance. |
| Browser file loading blocks fetch. | Include an inline fallback copy of the sample data. |
