# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use a dedicated `hadara.task.upgrade_scaffold.v1` report schema. | Accepted | The command is a task surface, not a protocol remediation command, so reusing `hadara.protocol.remediation.v1` would mislabel the command. | Schema fixture tests passed. |
| D-2 | Append missing frame blocks instead of rewriting legacy files. | Accepted | Non-destructive behavior matters more than perfect migration aesthetics. | Execute/idempotence tests passed. |
