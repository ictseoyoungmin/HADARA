# rc1 Capsule 5 - State Verify, Doctor, and CI Integration

## Capsule Goal

Make the state projection visible in common worker/operator flows without adding hidden writes.

## Scope

| In Scope | Notes |
|---|---|
| Add projection summary to an existing read-only surface or a small `state verify` report. | Prefer additive fields if possible. |
| Surface state issues through protocol doctor or status. | Make drift visible before close. |
| Add advisory CI gate integration. | Avoid strict historical-blocking rollout. |
| Document severity and rollout policy. | Workers need to know what blocks. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Strict CI blocking for all drift. | Too noisy for rollout. |
| Automatic repair. | Separate future task. |
| Release publish gate changes. | Release readiness capsule decides later. |

## Files Likely to Change

```text
src/cli/status.ts
src/protocol/doctor.ts or related service
src/ci/gate.ts
tests/unit/status-json.test.ts
tests/unit/protocol-consistency.test.ts
tests/unit/ci-gate.test.ts
docs/COMMAND_SURFACE.md if a new command is added
```

## Tests

```bash
npm run test:focused -- tests/unit/state-projection.test.ts tests/unit/status-json.test.ts tests/unit/protocol-consistency.test.ts tests/unit/ci-gate.test.ts
npm run dev:docker-sync-build
git diff --check
```

## Done Criteria

| ID | Criterion |
|---|---|
| DC-1 | Common read-only report exposes state consistency summary. |
| DC-2 | Advisory CI includes state consistency issues without hidden writes. |
| DC-3 | Strict behavior is documented and conservative. |
| DC-4 | Issue output is concise and includes code, severity, path, and fixHint. |
