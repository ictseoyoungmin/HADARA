# HADARA 0.5.0-rc.0

HADARA 0.5.0-rc.0 is a prerelease candidate for the status-first agent loop. It makes `hadara status --json` the primary new-session ingress and moves useful session/bootstrap facts into structured status and task-status read models.

## Highlights

- `hadara status --json` now defaults to `hadara.project.status.v2`, combining project state, task-selection guidance, current problems, validation baseline, readiness, and bounded diagnostics.
- `hadara task status --json` exposes task-selection status v2 and selected-task cockpit output, including phase, close readiness, blockers, next actions, evidence/validation summaries, and routed context pointers.
- Public `session start` guidance and routing are removed from the 0.5 current path. Use `status`, `task status`, and `context pack` instead.
- 0.4.6 lifecycle safety remains intact: task-local evidence stays canonical and `task finalize --execute --auto` remains the ordinary guarded close path.
- v1 compatibility routes remain available through the 0.5.x transition for explicit compatibility consumers; v2 is the default 0.5 status contract.

## Full-Suite Cleanup

T-0649 resolves full-suite regressions found after initial release readiness:

- dogfood fixture expectations now accept default selected-task status v2;
- Task Capsule and task-create tests expect timestamped `YYYY-MM-DDTHH:mm` Identity fields;
- task finish tests cover HANDOFF Identity writes in addition to TASK.md and Task Board writes;
- blocked evidence semantics now require documentation to mention the specific blocked evidence record or summary before treating it as explained.

## Validation

- T-0634 through T-0647 implemented and dogfooded the 0.5.0 status ingress, task-selection status v2, selected-task cockpit, and public session-start removal.
- T-0648 refreshed source metadata, release notes, focused validation, package smoke dry-run, and strict release gate.
- T-0649 focused regression tests passed, TypeScript build passed, and direct `timeout 300 npm test` passed with 154 test files and 1132 tests.

## Operator Notes

- npm prerelease target: `hadara@0.5.0-rc.0` on dist-tag `next`.
- GitHub Release target: `v0.5.0-rc.0` as a prerelease.
- After publication, run installed-package recycle from `hadara@next` with expected version `0.5.0-rc.0`.
