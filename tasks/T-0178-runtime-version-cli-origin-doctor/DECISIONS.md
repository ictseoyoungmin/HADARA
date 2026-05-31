# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0178-1 | Expose runtime origin as `hadara version --verbose --json`. | Accepted | The command is intuitive for humans and machines checking which CLI build is running. | Runtime version tests and built CLI smoke. |
| D-0178-2 | Keep runtime origin diagnosis read-only. | Accepted | Build/sync mutation belongs in the separate Docker dev sync-build capsule. | CLI JSON contract and T-0178 scope. |
