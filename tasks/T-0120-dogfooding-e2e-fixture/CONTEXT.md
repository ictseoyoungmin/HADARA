# Context

- Required docs read: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/V1_0_CAPSULE_BACKLOG.md`, and relevant T-0119 capsule docs.
- `docs/DEVELOPMENT_SLICES.md` slice 75 calls for a Dogfooding E2E Fixture that proves context, capsule, evidence, handoff, policy, and harness continuity.
- `docs/V1_0_CAPSULE_BACKLOG.md` lists this as the next P2 productization capsule after release/packaging planning.
- Docker remains the authoritative validation path because host Node/npm is unreliable in this WSL environment.
- This slice should remain a deterministic test fixture, not a new public command or live execution surface.
