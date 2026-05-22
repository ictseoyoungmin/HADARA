# Context

T-0031 extracted init and run scaffold helpers from `src/cli/main.ts`. T-0032 extracted harness validate/replay handling. `docs/AGENT_HANDOFF.md` recommends continuing command handler extraction with another cohesive group, such as evidence or policy.

This task extracts only CLI orchestration for the `evidence` group. The evidence storage implementation remains in `src/evidence/evidence.ts`, and JSON report construction remains in `src/cli/evidence-json.ts`.
