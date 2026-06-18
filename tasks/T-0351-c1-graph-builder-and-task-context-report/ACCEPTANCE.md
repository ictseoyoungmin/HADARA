# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-10 | Internal graph report builder assembles extractor outputs, state projection, graph summary, task context, cache metadata, and overall ok status. | Done | `src/context/context-graph-builder.ts`; ev:T-0351:8783d5087eed426ca228ce02 |
| AC-11 | Task context report derives read-first, read-if-needed, do-not-read, evidence, command, known-problem, validation, and state-issue candidates from graph data. | Done | `tests/unit/context-graph-builder.test.ts`; ev:T-0351:8783d5087eed426ca228ce02 |
| AC-12 | Focused builder/projection/schema coverage, TypeScript build, full Docker check, dist refresh, built CLI smoke, and diff check pass. | Done | ev:T-0351:8783d5087eed426ca228ce02 |
| AC-13 | Capsule and shared state docs describe completion and the next CLI/read-surface capsule. | Done | docs/PROJECT_STATE.md, docs/AGENT_HANDOFF.md, docs/DEVELOPMENT_SLICES.md |
