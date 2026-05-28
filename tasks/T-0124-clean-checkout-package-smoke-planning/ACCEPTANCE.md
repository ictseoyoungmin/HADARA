# Acceptance Criteria

- [x] `docs/TEST_STRATEGY.md` documents the clean-checkout package smoke sequence and states that current smoke planning performs no packaging or release execution.
- [x] `hadara release gate --mode strict --json` requires the explicit clean-checkout package smoke plan markers before passing that readiness check.
- [x] Focused regression tests cover the stricter release-gate clean-checkout check.
- [x] Docker validation evidence is recorded in `EVIDENCE.md` and `evidence.jsonl`.
- [x] `docs/TASK_BOARD.md`, `docs/PROJECT_STATE.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/AGENT_HANDOFF.md` are updated before stopping.
