# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Existing Task Board `Notes` cell survives `task finish --execute`. | Done | Focused regression and built CLI smoke passed. |
| AC-2 | Extra Task Board cells survive `task finish --execute`. | Done | Focused regression and built CLI smoke passed. |
| AC-3 | `Status` updates to `Done`. | Done | Existing focused regression passed. |
| AC-4 | `Capsule` path updates if stale. | Done | Focused regression passed. |
| AC-5 | `Title` syncs from Task Capsule title. | Done | Focused regression passed. |
| AC-6 | Generated title containing raw `|` does not break the table. | Done | Focused regression passed. |
| AC-7 | Escaped pipe coverage is included for preserved cells. | Done | Focused regression and built CLI smoke passed. |
| AC-8 | Workflow docs record Task Board cell ownership policy. | Done | Docs regression passed. |
| AC-9 | Evidence is attached and handoff/shared state docs are updated before close. | Done | Evidence `ev:T-0305:1c0b3d64e7354e098c26e53e`; Project State, Agent Handoff, Development Slices, and task handoff updated. |
