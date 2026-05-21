# Risks

| Risk | Mitigation |
|---|---|
| Policy check command accidentally executes shell text. | Keep this slice evaluation-only and do not add ShellTool execution. |
| Denied policy output is mistaken for command failure. | Use explicit schema and exit code `2` from the CLI spec. |
| Scope expands into full parser work. | Reuse the existing minimal tokenizer and record parser limits in handoff. |

