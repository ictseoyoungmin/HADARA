# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Ambiguous command logs are over-classified as validation proof. | Weak evidence could satisfy Done incorrectly. | Medium | Use conservative category mapping and tests for arbitrary command logs. | Mitigated |
| Failed evidence free text is treated as resolved. | Real failures could be hidden by vague wording. | Medium | Require exact `supersedes:<id>` / `resolves:<id>`, later passed same-category evidence, or residual-risk docs. | Mitigated |
| Scope expands into evidence writer migration. | Capsule becomes too large and risky. | Medium | Keep writer, init, Markdown migration, MCP writes, and release gate enforcement out of scope. | Mitigated |
| Downstream integration assumes semantics are already enforced by lint/harness. | Operators may expect behavior not yet wired. | Low | Document T-0187/T-0188 as integration follow-ups. | Carry Forward |
