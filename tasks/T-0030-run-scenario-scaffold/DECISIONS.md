# Decisions

| Decision | Rationale |
|---|---|
| Store generated scenarios under `.hadara/scenarios/`. | Keeps deterministic harness inputs in project context near other HADARA metadata. |
| Default fixture output is a placeholder. | Avoids pretending that a command actually ran. |
