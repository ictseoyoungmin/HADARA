# Acceptance Criteria

- [x] `hadara release gate --json` reports package/bin/script, CI, Node policy, clean-checkout smoke, generated artifact policy, and operational debt checks.
- [x] Advisory mode remains warning-only for open high operational debt, while strict mode remains blocking with exit code 6.
- [x] No release archive, checksum, publication, shell execution surface, provider call, MCP release tool, or write-capable release behavior is added.
- [x] Focused release-gate tests pass.
- [x] Docker clean-copy build and built CLI release-gate smoke pass.
- [x] Evidence is attached.
- [x] Handoff is updated.
