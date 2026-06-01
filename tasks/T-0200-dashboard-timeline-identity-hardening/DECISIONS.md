# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use normalized legacy ids as timeline evidence event ids until persisted v2 ids exist. | Accepted | This improves audit metadata while still exposing `idStability: unstable-on-reorder` for legacy records. | Timeline event fields include `evidenceIdSource` and `evidenceIdStability`. |
| D-2 | Preserve `artifact-N` only as fallback. | Accepted | Artifact display ids are not durable evidence identity. | Test asserts ordinary events do not use `artifact-` evidence ids. |
