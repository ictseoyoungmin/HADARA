# Decisions

| ID | Decision | Rationale | Status |
|---|---|---|---|
| D-1 | Derive `tier` from existing registry `status`, `kind`, `path`, and `readWhen` fields instead of adding registry storage. | T-0308 is scoped to command output behavior and backward compatibility. | Accepted |
| D-2 | Keep `documents` and `excluded` arrays unchanged except for additive entry fields. | Existing consumers should keep working. | Accepted |

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
