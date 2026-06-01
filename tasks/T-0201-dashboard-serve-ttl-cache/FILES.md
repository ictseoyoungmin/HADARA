# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/services/dashboard-cache.ts | Add | Shared process-memory TTL cache service and metadata helpers. | Done |
| src/cli/dashboard.ts | Update | Wrap aggregate dashboard API routes with cache behavior and add cache status read route. | Done |
| src/services/dashboard-bootstrap.ts | Update | Use shared cache metadata type and disabled metadata for uncached direct service calls. | Done |
| src/services/dashboard-task-detail.ts | Update | Add direct-service disabled cache metadata. | Done |
| src/services/dashboard-timeline.ts | Update | Add direct-service disabled cache metadata. | Done |
| src/schemas/dashboard-*.schema.json | Update | Allow cache status metadata on aggregate reports. | Done |
| tests/unit/dashboard-cache.test.ts | Add | Cover miss/hit/stale/bypass behavior and non-mutating metadata decoration. | Done |
| tests/unit/dashboard-*.test.ts | Update | Cover route-level cache metadata and schema compatibility. | Done |
| docs/* and task capsule | Update | Reflect T-0201 status and boundaries. | Done |
