# Handoff

## Last Completed

- Added shared `parsePermissionMode()` and applied runtime mode validation to policy, run, fake-shell, preflight, and agent loop paths.
- Changed agent loop semantics so failed fake-shell observations fail the overall run.
- Added evidence result parsing and stricter harness evidence JSONL enum validation.
- Changed run scaffold to reject duplicate scenario files instead of silently keeping stale content.
- Updated task create title extraction to skip global flags.
- Added focused regression tests for all reviewed issues.
- Docker `npm ci && npm run check` passed: 21 test files passed, 105 tests passed.
- Built CLI hardening smokes passed.
- Docker built CLI `harness validate --task T-0037 --level done --json` returned `ok: true`.

## Next Recommended Step

Continue with the next roadmap slice, such as Hermes/MCP bridge expansion.
