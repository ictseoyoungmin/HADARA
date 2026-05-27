# Acceptance Criteria

- [x] A deterministic dogfooding fixture exists for the HADARA-on-HADARA capsule lifecycle.
- [x] The fixture replay starts from in-memory context export and verifies required context guidance.
- [x] The replay creates and completes a temporary Task Capsule with policy continuity, public evidence, handoff update, and done-level harness validation.
- [x] The replay asserts generated `TASK.md`, `EVIDENCE.md`, `HANDOFF.md`, and `evidence.jsonl` contents in the temporary capsule.
- [x] Policy check outcomes are explicitly asserted as allowed, requested, or blocked.
- [x] A built CLI smoke replay uses CLI JSON surfaces only and avoids shell/provider/MCP/release execution.
- [x] The fixture adds no real shell execution, provider call, MCP write, release/package execution, or remote CI behavior.
- [x] Focused harness validation passes.
- [x] Full Docker validation passes.
- [x] Evidence is attached.
- [x] Handoff is updated.
