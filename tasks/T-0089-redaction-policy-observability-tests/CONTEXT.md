# Context

- T-0074 introduced `hadara.redaction.report.v1` with pattern ids, severities, byte counts, and finding counts.
- T-0075 changed public artifact policy to block only findings at severity `high` or above, preserving lower-severity findings as diagnostics.
- T-0082 recorded the remaining gap: tests proved helper behavior more strongly than the full evidence artifact policy path.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` says future observability should expose only safe metadata such as pattern ids, severities, and counts.
- This slice should avoid new CLI/MCP/dashboard security surfaces; it should strengthen internal reportability and regression coverage first.
