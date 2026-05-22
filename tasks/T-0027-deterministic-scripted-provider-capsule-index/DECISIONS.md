# Decisions

| Decision | Rationale |
|---|---|
| `ScriptedProvider` consumes exactly one step per `chat()` call. | Replay and deterministic harness scripts should model a timeline, not a search table. |
| New Task Capsules include an empty `evidence.jsonl`. | The file is part of the required capsule contract, even before evidence exists. |
