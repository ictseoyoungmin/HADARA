# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | One HealthVerdict and one ProvenanceBadge replace both chip strips. | Done | Visual gate: one verdict, exactly one provenance badge. |
| AC-2 | Shell paints instantly with skeletons; layout responsive at >=1280 and >=768. | Done | app.css media queries; skeleton render before data. |
| AC-3 | No localStorage/sessionStorage/indexedDB/cookies for project state. | Done | Visual gate no-storage check; source scan in dashboard-static.test.ts. |
| AC-4 | Bootstrap-first progressive loading is preserved. | Done | model.ts fallback order bootstrap -> status -> fixture -> inline. |
