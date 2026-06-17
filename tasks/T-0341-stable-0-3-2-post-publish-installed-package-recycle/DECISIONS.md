# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use temp-prefix installed `hadara@latest` as primary package proof. | Accepted | T-0338 recorded exact `npx` stale-shim behavior in this workspace; temp-prefix installed bin is the reliable consumer path. | T-0338 findings; T-0341 plan. |
| D-2 | Treat T-0341 as verification-only with no registry mutation. | Accepted | T-0340 already published stable `0.3.2`; this task closes the stable line by proving installed package workflows. | T-0340 handoff and reviewer instruction. |
