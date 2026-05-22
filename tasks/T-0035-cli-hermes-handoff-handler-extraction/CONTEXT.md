# Context

T-0031 through T-0034 extracted init, run scaffold, harness, evidence, and policy handling from `src/cli/main.ts`. `docs/AGENT_HANDOFF.md` recommends continuing extraction with Hermes or handoff.

Hermes and handoff are both small command groups whose domain logic already lives outside the dispatcher. This task extracts their CLI orchestration together as one cohesive cleanup slice.
