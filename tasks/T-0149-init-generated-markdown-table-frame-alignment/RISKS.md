# Risks

| Risk | Mitigation |
|---|---|
| Generated docs accidentally reference files not created by a smaller profile. | Add basic-profile absent-reference assertions. |
| Generic init scaffold leaks HADARA-dev optional surfaces as defaults. | Add content absence checks for Hermes, MCP, dashboard, and provider defaults. |
| `.gitignore` hides project-owned `data/` directories. | Remove `data/` from generated ignore rules and assert absence. |
