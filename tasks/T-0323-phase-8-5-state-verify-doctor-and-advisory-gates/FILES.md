# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/cli/main.ts` | Update | Dispatch the new `state` command family. | Done |
| `src/cli/state.ts` | Add | Implement `hadara state verify [--json]`. | Done |
| `src/cli/status.ts` | Update | Enable compact stateConsistency output for CLI status. | Done |
| `src/services/state-projection.ts` | Update | Add reusable advisory summary and text formatting helpers. | Done |
| `src/services/operations-status-service.ts` | Update | Add optional compact stateConsistency summary to ops status reports. | Done |
| `src/services/protocol-consistency.ts` | Update | Add advisory stateConsistency summary to all-scope protocol doctor reports. | Done |
| `src/services/ci-gate.ts` | Update | Add state consistency advisory check and warnings. | Done |
| `src/services/capability-registry.ts` | Update | Register `state.verify` and related command links. | Done |
| `docs/COMMAND_SURFACE.md` | Update | Document state verify and advisory rollout policy. | Done |
| `docs/LIFECYCLE_GUIDE.md` | Update | Keep diagnostic command list aligned with registry. | Done |
| `tests/unit/state-projection.test.ts` | Update | Cover `state verify` JSON dispatch. | Done |
| `tests/unit/status-json.test.ts` | Update | Cover status `stateConsistency` CLI output. | Done |
| `tests/unit/protocol-cli.test.ts` | Update | Cover protocol doctor all-scope `stateConsistency`. | Done |
| `tests/unit/ci-gate.test.ts` | Update | Cover CI state check and advisory warnings. | Done |
| `tasks/T-0323-phase-8-5-state-verify-doctor-and-advisory-gates/*` | Update | Maintain capsule evidence and handoff. | Done |
