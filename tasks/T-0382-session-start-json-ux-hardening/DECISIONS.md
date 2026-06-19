# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add structured `guidance` while preserving existing lifecycle command arrays. | Accepted | This gives machine consumers stable fields without breaking existing callers that read command strings. | `ev:T-0382:93c876280718445e833270ba` |
| D-2 | Make no-task bounded Session Start degraded-ok instead of a hard error. | Accepted | `hadara session start --json` is the documented default entry point and should route to `task next` without hidden graph discovery. | `ev:T-0382:93c876280718445e833270ba` |
