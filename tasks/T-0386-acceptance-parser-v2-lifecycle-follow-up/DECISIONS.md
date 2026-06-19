# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a shared acceptance readiness parser instead of extending separate status-string checks. | Accepted | Harness and protocol-consistency previously duplicated incomplete status logic; a shared parser reduces drift. | `ev:T-0386:4413cd420e354248bb671461` |
| D-2 | Preserve public v1 issue-code compatibility for ready/close/protocol reports. | Accepted | T-0386 is a hardening slice, not a public schema replacement. | `ev:T-0386:4413cd420e354248bb671461` |
| D-3 | Accept v2 acceptance table headers as standard capsule format markers. | Accepted | V2 tables add Origin/Required/Deferrable while preserving ID/Criterion/Status/Evidence semantics. | `ev:T-0386:4413cd420e354248bb671461` |
