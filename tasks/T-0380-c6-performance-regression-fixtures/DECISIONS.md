# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Performance threshold comparison is advisory by default. | Accepted | Mounted filesystem timings vary too much for a default hard CI gate, but operators still need repeatable budget checks. | T-0380 |
| D-2 | Session Start workloads are part of the performance baseline. | Accepted | T-0379 made default Session Start the main C5/C6 warm-cache consumer, so regression fixtures must include it. | T-0380 |
