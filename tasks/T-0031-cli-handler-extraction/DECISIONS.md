# Decisions

| Decision | Rationale |
|---|---|
| Extract init and run scaffold first. | They are recently added, cohesive, and low-risk to separate. |
| Keep command dispatch in `main.ts`. | Avoid a broad router rewrite while reducing immediate LOC pressure. |
