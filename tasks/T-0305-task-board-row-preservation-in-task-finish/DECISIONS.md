# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat Task Board `ID`, `Title`, `Status`, and `Capsule` as command-owned, and preserve `Notes` plus extra cells. | Accepted | Matches the rc2 T-0305 ownership policy and avoids losing human-authored notes. | Implementation planned in `src/task/task-finish.ts`. |
| D-2 | Implement a small Task Board row splitter local to `task finish` instead of broadening the shared Markdown parser. | Accepted | The capsule needs escaped-pipe preservation but should not become a general Markdown parser rewrite. | Focused tests will cover escaped pipes and inline-code pipes where practical. |
