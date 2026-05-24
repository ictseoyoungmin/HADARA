# Decisions

- Use a shared service report builder for both CLI and MCP so discovery stays transport-neutral.
- Include opt-in `hadara.evidence.attach` in the report as a write surface with `enabledByDefault` reflecting the current MCP server profile.
- Keep disabled shell/provider/release/broad-write surfaces as explicit discovery records, not registered tools.
