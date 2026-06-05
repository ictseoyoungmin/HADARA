# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Preserve existing task lifecycle commands and add metadata only. | Accepted | T-0254 must not execute other commands or require new CLI actor options. | No CLI handler orchestration added; focused tests call report builders. |
| D-2 | Keep existing `kind`/`message` next-action fields while adding Phase 6 fields. | Accepted | Existing consumers can continue reading old fields while new agents use `summary`, `writeBoundary`, `recommendedActorRole`, `requiresBeforeHash`, and `stalePlanRisk`. | Lifecycle tests assert both old command fields and new metadata. |
