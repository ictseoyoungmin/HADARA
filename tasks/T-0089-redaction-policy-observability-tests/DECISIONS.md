# Decisions

- Keep observability inside shared evidence/redaction services for this slice; do not add a CLI, MCP, or dashboard surface yet.
- Expose only safe diagnostic metadata: pattern id, severity, count, and byte counts. Do not include raw artifact text or redacted text in policy reports by default.
- Use injectable redaction patterns for tests so medium-severity behavior can be proven without changing the default production registry.
- Keep public artifact blocking threshold at `high`.
