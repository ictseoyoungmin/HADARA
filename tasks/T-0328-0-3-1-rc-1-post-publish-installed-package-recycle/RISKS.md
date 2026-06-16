# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| npm registry propagation, DNS, or npx cache causes flaky exact package execution. | Could obscure whether the published package works. | Medium | Use npm registry metadata plus temp-prefix installed-bin proof as canonical; record npx ambiguity as an environment finding if needed. | Open |
| Recycle mutates developer machine global state. | Could leave stale or unwanted global installs. | Low | Prefer disposable temp-prefix installs and temp project directories. | Open |
