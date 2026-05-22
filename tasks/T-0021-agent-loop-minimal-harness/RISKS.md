# Risks

| Risk | Mitigation |
|---|---|
| Loop grows into a full agent controller. | Keep this slice deterministic and bounded. |
| Tool request parsing becomes ad hoc protocol sprawl. | Use a tiny JSON command envelope and reject invalid shapes. |
| Accidental real shell execution. | Route only through `runFakeShellCommand` fixtures. |
| Evidence index drift goes unnoticed. | Require `evidence.jsonl` in harness validation. |
