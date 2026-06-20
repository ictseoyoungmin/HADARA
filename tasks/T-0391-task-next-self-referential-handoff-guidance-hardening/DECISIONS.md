# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat handoff steps that tell the operator to run or select with `task next` as meta-guidance, not work. | Accepted | Dogfooding showed the previous behavior generated `hadara task create 'Run task next...'`, which is not a useful capsule. | `ev:T-0391:cc9957fe4c954754bee38b41` |
| D-2 | Fall back to Development Slices or Task Board when handoff next-step guidance is meta-only. | Accepted | This preserves the existing source order without forcing agents to interpret prose manually. | `ev:T-0391:cc9957fe4c954754bee38b41` |
| D-3 | Keep the change as a parser/actionability filter rather than changing the report schema. | Accepted | Consumers already understand `recommendations`, `sources`, and `backlog`; the bug is in what qualifies as actionable. | `ev:T-0391:cc9957fe4c954754bee38b41` |
| D-4 | Prefer primary open Task Board rows before legacy `Partial` rows during fallback. | Accepted | After meta-guidance was filtered, dogfooding showed an old Partial row could outrank the active Draft capsule. | `ev:T-0391:d22ebea228d34e9b966efe53` |
