# Context

T-0026 exposed two determinism and consistency issues:

- `ScriptedProvider` used `find()`, so a broad earlier match could be reused instead of consuming the next scripted step.
- `createTaskCapsule()` created `EVIDENCE.md` but not `evidence.jsonl`, even though harness validation treats `evidence.jsonl` as a required capsule file.

This task handles those P0 fixes only.
