# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Future implementation bypasses policy gates. | Shell execution could leak data or run unsafe commands. | Medium | Design requires policy preflight and approval handling before execution. | Mitigated |
| Raw stdout/stderr leaks into committed evidence. | Secrets/private paths could be exposed. | Medium | Design requires size limits, redaction, and private/local raw-log boundaries. | Mitigated |
| Design is mistaken for implementation. | Operators may expect `evidence from-command` to exist. | Low | CLI contract states it is not implemented. | Mitigated |
