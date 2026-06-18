# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a separate detailed C6 implementation spec instead of expanding the existing C6 summary spec in place. | Accepted | The existing `05` document is a stable compact spec; the new file can hold implementation sequencing, performance algorithms, and code-change requirements without bloating the summary. | `07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md`. |
| D-2 | Specify explicit cache warm/write surfaces while keeping read-only context commands non-mutating. | Accepted | HADARA context commands currently promise read-only behavior; local cache speed must not create hidden writes. | C6 spec Cache Command Boundary section. |
| D-3 | Adapt Graphify's manifest/update pattern, but not its committed output or model extraction behavior. | Accepted | HADARA needs fast local context projections, not a new committed graph artifact or provider-dependent indexing path. | C6 spec Graphify Lessons section. |
