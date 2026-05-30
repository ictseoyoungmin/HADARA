# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| TD-1 | Keep `## Status` in `TASK.md` even though v2 also has a Metadata status row. | Accepted | Existing harness status parsing relies on the section, and T-0152 should not force a broader status parser rewrite. | Focused harness tests pass. |
| TD-2 | Accept both legacy and v2 capsule frames in harness validation. | Accepted | Existing completed capsules should remain valid until an explicit upgrade/remediation capsule exists. | `validateCapsuleFormatMarkdown` accepts both marker families. |
| TD-3 | Keep protocol doctor, remediation, and schema-contract implementation out of T-0152. | Accepted | Phase 2 breaks these into T-0153 through T-0157 to keep slices small. | Backlog and slices updated. |
