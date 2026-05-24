# Risks

| Risk | Mitigation |
|---|---|
| Active run state could be mistaken for a queue. | Keep schema singular and document no queue or multi-agent semantics. |
| Local state could be accidentally committed. | Store runtime manifest under `.hadara/local/`, which is already ignored. |
