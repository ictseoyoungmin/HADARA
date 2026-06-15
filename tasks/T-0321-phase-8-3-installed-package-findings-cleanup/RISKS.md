# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Over-correcting governed profile by deleting useful generated docs. | Users lose refactor/roadmap scaffolds. | Low | Keep `REFACTOR_LOG.md` generated and registered; only remove it from default Required Reading. | Mitigated |
| Docs doctor Required Reading parsing change hides real required-reading drift. | Unregistered required docs could be missed. | Medium | Parse only AGENTS/SOP `## Required Reading` sections and add regression for unregistered rows inside the section. | Mitigated |
| Temp-prefix guidance is mistaken for a ban on `npx`. | Users may avoid convenient npx usage. | Low | Document `npx` as acceptable convenience while temp-prefix installed bin is stronger evidence when PATH/cache trust matters. | Mitigated |
