# Acceptance Criteria

- [x] Shared `hadara.tools.list.v1` report lists stable CLI/MCP surfaces.
- [x] Report includes the current CLI help surface, including CLI-owned write and deterministic execution commands.
- [x] Report includes opt-in `hadara.evidence.attach` without making it default-on.
- [x] Report exposes `availability`, `risk`, and `requiresApproval` where relevant.
- [x] Report lists disabled shell/provider/release/broad-write MCP surfaces.
- [x] `hadara tools list --json` emits the report.
- [x] Read-only MCP `hadara.tools.list` returns the report as one JSON text payload.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
