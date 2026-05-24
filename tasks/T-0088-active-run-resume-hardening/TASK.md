# T-0088 Active Run Resume Hardening

## Goal

Harden active-run resume guidance so external agents read canonical Task Capsule paths and the stable active-run JSON surfaces have schema fixtures.

## Scope

- Canonicalize active-run resume guidance from `activeRun.taskId` by resolving the actual Task Capsule path.
- Warn with `ACTIVE_RUN_CAPSULE_MISMATCH` when the local active-run manifest capsule path differs from the canonical Task Capsule path.
- Use the canonical capsule path in `resume` and `resumePrompt.mustRead` whenever the Task Capsule exists.
- Add JSON Schema fixtures for `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1`.
- Strengthen CLI/docs wording that `run-state resume` is read-only guidance and does not resume a process.

## Out of Scope

- No active-run write commands or mutation behavior.
- No schema runtime validation or release-gate enforcement.
- No queue, scheduler, multi-agent behavior, shell execution, provider calls, MCP writes, or dashboard live APIs.

## Status

Done
