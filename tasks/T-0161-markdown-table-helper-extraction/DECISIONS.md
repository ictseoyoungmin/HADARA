# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Put the shared helper in `src/services/markdown-table.ts`. | Accepted | Protocol consistency/profile/remediation code already lives in services, and T-0161 is a service-level helper extraction. | Focused tests passed. |
| D-2 | Preserve the previous permissive row parser behavior. | Accepted | This slice should reduce duplication without changing protocol doctor or harness semantics. | Full Docker check passed. |
