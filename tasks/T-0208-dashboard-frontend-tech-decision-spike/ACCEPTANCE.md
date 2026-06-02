# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | A DECISIONS.md entry selects A or B with rationale. | Done | D-0011 selects B. |
| AC-2 | The chosen path serves as a single static asset under the existing CSP and dashboard serve route. | Done | Built 49 kB inlined index.html; host serve returned 200 under self-only CSP. |
| AC-3 | No CDN / runtime network dependency. | Done | build.mjs guard rejects external resources; CSP connect-src self. |
