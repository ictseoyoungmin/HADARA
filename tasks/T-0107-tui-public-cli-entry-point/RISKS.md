# Risks

| Risk | Mitigation |
|---|---|
| Public `hadara tui` could hang in non-interactive environments. | Refuse non-TTY interactive mode and provide `--snapshot` for smoke checks. |
| CLI entry point could accidentally introduce writes or execution. | Reuse existing TUI read-model/terminal shell only, add no write paths, and keep capability registry marked read-only. |
| Interactive terminal behavior is hard to test directly. | Use injected input/output streams and focused unit tests for startup, raw-mode restoration, and quit handling. |
| Process signal listeners could accumulate in injected or long-lived environments. | Remove `SIGINT` and `exit` listeners when the interactive session stops normally. |
| Refresh effect flags could remain set after failed refresh paths. | Clear refresh and detail-refresh flags for both complete and failed completion signals. |
