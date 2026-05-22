# Risks

| Risk | Mitigation |
|---|---|
| Existing tests may rely on reusable broad scripted matches. | Update tests to make script order explicit and preserve fallback error behavior. |
| Empty evidence indexes might change validation assumptions. | Keep empty `evidence.jsonl` valid and preserve missing-file validation by deleting it in the regression test. |
