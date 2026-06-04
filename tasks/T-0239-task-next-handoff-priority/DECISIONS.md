# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prefer actionable Agent Handoff next work over legacy Task Board fallback rows. | Accepted | Handoff is the compact current-state source of truth for next-session work, while old Partial rows can represent backlog. | New task-next refactor spec |
| D-2 | Keep fallback/backlog rows visible in the report instead of reclassifying them. | Accepted | `task next` should stay read-only and should not perform historical cleanup. | New task-next refactor spec |
| D-3 | Preserve `hadara.task.next.v1` as an additive contract. | Accepted | Existing consumers should continue to read `recommendations`, while new consumers can inspect sourceKind/policy/backlog. | Schema compatibility posture |
