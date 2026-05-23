# Decisions

| Decision | Rationale |
|---|---|
| Require `approval.actor` and `approval.reason`. | This creates a minimal explicit operator record without inventing token infrastructure yet. |
| Keep approval metadata out of evidence records. | Evidence remains portable project history; operational authorization stays in private audit. |
| Add nested object validation to MCP dispatch. | The approval object should be rejected before any write path runs. |
