# AGENT_HANDOFF

## Current Branch

main

## Last Completed

- Created T-0007 Bootstrap Validation Pass and marked it Done with evidence.
- Fixed Task Capsule `EVIDENCE.md` template to use the same 4-column schema as `appendEvidence`.
- Added harness coverage that appends evidence without breaking the Markdown table.
- Added `package-lock.json` and a minimal GitHub Actions CI workflow.
- Fixed strict TypeScript handling for the CLI evidence summary fallback.
- Verified `npm ci` and `npm run check` inside Docker.
- Verified seed CLI loop in Docker: doctor, init, task create/list/show, evidence collect, handoff update.

## In Progress

No active implementation task.

## Do Not Change Without Updating Tests

- `src/providers/provider-contract.ts`
- `src/core/paths.ts`
- `src/task/task-capsule.ts`
- `src/policy/policy.ts`

## Known Problems

- Host WSL environment does not currently expose a usable Linux `node` binary.
- Windows Node/npm shims are on PATH but fail under this WSL sandbox.
- Docker is the working validation path for now.
- `npm ci` reports 5 moderate audit findings from current dev dependencies; do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has been added but has not yet been observed on a remote push/PR.

## Next Recommended Step

1. Push branch and confirm GitHub Actions CI passes with Node 22.
2. Track npm audit findings separately.
3. Continue with T-0002/T-0005 hardening before provider or dashboard work.

## Evidence

- `tasks/T-0007-bootstrap-validation-pass/EVIDENCE.md`
- Docker check: 5 test files passed, 10 tests passed.
