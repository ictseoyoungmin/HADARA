# Risks

| Risk | Mitigation |
|---|---|
| Hermes JSON is mistaken for full Hermes integration. | Scope envelope to existing context-file detect/export only. |
| Export leaks machine-local absolute paths. | Use project-relative output path in JSON. |
| Existing scripts expect old non-JSON output. | Preserve non-JSON detect/export output. |

