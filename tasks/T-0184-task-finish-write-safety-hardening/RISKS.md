# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Finish writes overwrite newer operator edits. | Task or board state could be lost. | Medium | Add expected existence/hash conflict checks before writing. | Mitigated |
| Malformed Task Board accepts appended rows. | Could deepen doc drift. | Medium | Refuse execute when canonical table frame is missing. | Mitigated |
| Regex replacement silently no-ops. | Report could claim applied without changing files. | Medium | Detect no-op/replacement failure and return blocking issue. | Mitigated |
| Generated createCommand breaks on quotes. | Copy/paste guidance can fail. | Low | Shell-quote titles with single quotes. | Mitigated |
