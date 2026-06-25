# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a compact `Default Agent Loop` section to generated `AGENTS.md`. | Accepted | Agents read `AGENTS.md` first; the current loop should be visible before broader rules. | ev:T-0416:54d2ca94759b4088ae2fbb7e |
| D-2 | Insert `session start` into generated SOP and task workflow standard loops. | Accepted | 0.3.4 has Session Start primary-action guidance, so fresh projects should route through it before lifecycle/finalize decisions. | ev:T-0416:54d2ca94759b4088ae2fbb7e |
| D-3 | Keep low-level `finish`/`ready`/`close`/`audit-close` wording as debugging/recovery guidance. | Accepted | HADARA still relies on those proof boundaries under finalize; removing them would weaken repair and command implementation docs. | ev:T-0416:da44946c779d43bea82e4547 |
