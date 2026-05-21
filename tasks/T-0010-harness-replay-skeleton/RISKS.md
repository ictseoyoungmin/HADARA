# Risks

| Risk | Mitigation |
|---|---|
| Replay schema grows into full agent loop too early. | Keep this slice to provider response and final expectation checks only. |
| Scenario output leaks absolute local paths. | Normalize scenario paths relative to project root with `/` separators. |
| Exit codes drift from CLI specification. | Use exit code `6` for replay/schema validation failures in this slice. |

