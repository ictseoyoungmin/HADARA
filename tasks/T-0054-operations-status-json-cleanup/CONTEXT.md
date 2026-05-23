# Context

T-0053 introduced `hadara status --json` and `hadara ops status --json`.

Cleanup feedback:

- Missing source docs should produce warning issues.
- Dashboard-facing task counts should keep stable keys.
- Raw status names should be reported separately.
- Phase parsing should prefer explicit markers instead of relying on HADARA-dev wording.
- Validation parsing should have a fallback beyond handoff phrasing.
- MCP status remains configured snapshot state, not live process state.
