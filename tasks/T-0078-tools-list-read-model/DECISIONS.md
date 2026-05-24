# Decisions

- Use a shared service report builder for both CLI and MCP so discovery stays transport-neutral.
- Include opt-in `hadara.evidence.attach` in the report as a write surface with `enabledByDefault` reflecting the current MCP server profile.
- Keep disabled shell/provider/release/broad-write surfaces as explicit discovery records, not registered tools.
- After review, move capability metadata into `src/services/capability-registry.ts` so the service layer does not import MCP transport schema files.
- Include the fuller current CLI command surface, including CLI-owned write and deterministic execution commands, with `category`, `readOnly`, `availability`, `risk`, and notes.
- Add `availability: default|opt-in|disabled|deferred` and `requiresApproval` so external agents do not have to infer semantics from `enabledByDefault` alone.
