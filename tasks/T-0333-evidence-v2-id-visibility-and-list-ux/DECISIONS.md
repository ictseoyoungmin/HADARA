# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `hadara.evidence.list.v1` as the schema id and add fields additively. | Accepted | T-0333 explicitly excludes an add-command/list schema rename; existing consumers can keep the persisted record shape while agents get id stability metadata. | Focused/full tests passed; schema fixture validation passed in full Docker sync-build. |
| D-2 | Display v1 compatibility ids in text output but mark them non-durable through JSON metadata and docs. | Accepted | Operators may inspect legacy records, but long-lived resolution examples should use durable persisted `ev:` ids only. | README, workflow docs, CLI JSON contract, and generated init docs updated. |
