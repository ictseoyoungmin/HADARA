# Decisions

| Decision | Rationale |
|---|---|
| Add `--enable-evidence-attach` as explicit opt-in. | Evidence attach is the first write-capable MCP tool and should not be exposed accidentally. |
| Reuse `createEvidenceCollectReport`. | Existing CLI evidence handling already enforces task lookup, workspace boundary, artifact policy, and report shape. |
