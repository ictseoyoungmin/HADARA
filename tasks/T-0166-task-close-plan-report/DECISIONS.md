# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement close plan through read-only service checks. | Accepted | It gives agents a stable next-action surface without adding writes. | Task close tests. |
| D-2 | Keep execute reserved in T-0166. | Accepted | The initial capsule should not append close evidence or update status. | Reserved execute test. |
