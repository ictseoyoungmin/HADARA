# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Commit HADARA-dev `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md`. | Accepted | `.hadara/context/HADARA_CONTEXT.md` routes readers to both files, and fresh init/migration already create them for consumer projects. | T-0313 baseline showed missing registry inference before adoption; post-adoption docs list uses committed registry. |
| D-2 | Generate artifacts from existing docs-registry service output rather than hand-authoring custom JSON. | Accepted | This keeps HADARA-dev dogfooding aligned with init/migration seed/projection behavior. | Used `createSeedDocumentRegistry('hadara-dev')`, `registryJson(...)`, and `renderDocRegistryMarkdown(...)`. |
| D-3 | Do not run broad `protocol migrate --target 0.3.0 --execute` in T-0313. | Accepted | Dry-run still plans protocol marker, command surface, and SOP marker writes beyond registry artifact dogfooding. | T-0313 protocol migration dry-run evidence. |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
