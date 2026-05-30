# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docs-scope command could be mistaken for full project/profile/remediation completion. | Users may expect `all` scope, profile drift guidance, or safe-auto fixes too early. | Medium | Keep CLI/docs/capsule wording explicit that T-0154 is docs-scope and read-only. | Mitigated |
| Markdown parsing could overfit HADARA-dev docs. | False positives in initialized projects with valid table-first docs. | Medium | Prefer stable required tables and conservative issue codes with focused fixture tests. | Mitigated |
| Host dependency gaps can delay validation. | Checks may fail before reaching tests. | Medium | Use Docker workflow recorded in SOP and handoff. | Mitigated |
