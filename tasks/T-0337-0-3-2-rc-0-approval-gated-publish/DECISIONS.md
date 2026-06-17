# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `scripts/release/manual-publish-rc.sh T-0337` as the publish path. | Accepted | It refreshes validation/evidence and keeps npm publish behind explicit execute confirmation. | T-0337 spec; helper read |
| D-2 | Do not request GitHub Release draft by default. | Accepted | T-0337 scopes GitHub Release as explicit-request only. | T-0337 out-of-scope |
