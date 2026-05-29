# Risks

| Risk | Mitigation |
|---|---|
| Removing Hermes defaults breaks explicit future compatibility expectations. | Keep Hermes out of init only; existing Hermes commands/docs in HADARA-dev remain unchanged. |
| Generated AGENTS becomes too project-specific. | Use general docs and describe project-specific docs as manually added through SOP required reading. |
| Scaffold becomes too heavy for minimal projects. | Keep advanced docs out of minimal output and put profile semantics in SOP. |
| Existing user files are overwritten. | Continue using `writeFileIfMissing` for scaffold files. |
