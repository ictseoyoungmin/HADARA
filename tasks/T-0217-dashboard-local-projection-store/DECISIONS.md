# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Store dashboard projections as `hadara.dashboard.projection_record.v1` wrapper records. | Accepted | A wrapper keeps section/key/generatedAt/project redaction metadata consistent across core, detail, timeline, and debt projections. | `src/services/dashboard-projection-store.ts`. |
| D-2 | Restrict section and key to simple file-safe tokens. | Accepted | Prevents traversal and keeps cache layout predictable for future refresh workers. | `dashboardProjectionFilePath` and focused tests. |
| D-3 | Use temp-file plus rename for replacement. | Accepted | Later background refresh can update projections without leaving partially-written JSON files. | `writeDashboardProjection` and focused tests. |
| D-4 | Reject serialized raw project-root paths before writing. | Accepted | Keeps projection cache aligned with redacted dashboard source contracts. | `assertDashboardProjectionBodyRedacted`. |
