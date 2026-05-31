# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prefer `docs/DEVELOPMENT_SLICES.md` for planned next work. | Accepted | It captures phase ordering and prerequisites better than Task Board alone. | `src/task/task-next.ts`. |
| D-2 | Keep `task next` read-only. | Accepted | Task creation and status mutation should remain explicit operator actions. | CLI contract; tests. |
| D-3 | Include `createCommand` only when a planned capsule is missing. | Accepted | Gives agents a precise next action without mutating state. | `tests/unit/task-next.test.ts`. |
