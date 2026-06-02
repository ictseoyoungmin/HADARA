# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Each metric carries context (label + tone/comparison). | Done | Visual gate metrics-carry-context; MetricsRow context strings. |
| AC-2 | "Inspect JSON" / "Bottom Inspector" are removed from the primary surface; a read-only DeveloperJSON disclosure remains. | Done | dashboard-static.test.ts asserts their absence; DeveloperJSON collapsed. |
| AC-3 | Copy-only / read-only preserved. | Done | No write/exec affordance; JSON view is text only. |
