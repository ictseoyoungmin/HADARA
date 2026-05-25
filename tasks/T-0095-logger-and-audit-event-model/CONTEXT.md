# Context

Relevant documents:

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`

Current logger/audit planning says `src/core/audit.ts` exists, while the general logger and structured event model remain weak.

Logging boundary for this slice:

- stdout remains user-facing result text/JSON only.
- stderr remains human-readable warning/error output.
- audit JSONL remains private portable-store structured records for write attempts, policy/evidence decisions, and related safety events.
- debug logs stay optional and disabled/deferred; this task does not add a debug log file.

The smallest useful implementation is a structured `hadara.event.v1` model plus schema fixture and compatibility-preserving audit writes.
