# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0697 |
| Title | RC2 Build Freshness and Clean Install Guard |
| Status | Done |
| Created | 2026-07-24T18:44 |
| Updated | 2026-07-24T19:11 |
## Last Completed

| Item | Evidence |
|---|---|
| `npm run check` now builds `dist` before tools type-check and `test:all`; Docker ext4 clean copy including `.hadara` passed clean `npm ci` and full check. | ev:T-0697:b6287de625eb4ec790628adb, ev:T-0697:e0fed34bf4fd42828d2479ec |
| Manual RC publish helper now rebuilds and verifies `node dist/cli/main.js version` before release artifact creation. | ev:T-0697:eae22eb9eeaf4e459da4335a |
| `package-lock.json` was regenerated so root devDependencies match `package.json` and Dashboard-only direct dependencies are absent. | ev:T-0697:c030f5ce7ba44b289afb3e6c, ev:T-0697:8ada5a6be1194d248457a486 |
| Public `context pack` routing/registry/docs/recycle-smoke exposure was removed; internal context-pack builder remains only for internal candidate/historical use. | ev:T-0697:eb23fa89dbc44cb5a74c6cef |
| Built CLI reports `distLooksStale: false`; diff hygiene passed. | ev:T-0697:2602690f00cc4f5d95e2b7d7, ev:T-0697:85ddc799f71f403da14b6930 |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Fresh-session RC2 dogfood and validation-baseline promotion. | actionable | Yes | T-0697 fixed the release build boundary blocker that should precede fresh dogfood. | `.hadara/context/HADARA_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, selected new Task Capsule |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host `npm ci` on the mounted WSL workspace failed with symlink EPERM after clearing `node_modules`. | Host-local `npm run ...` can fail until dependencies are restored in a compatible environment. | Use Docker ext4 clean-copy validation or reinstall dependencies in an environment that supports npm bin symlinks. |
| `npm run dev:docker-check` still omits `.hadara` from its copied workspace and can trip the status current-state fixture. | Wrapper-level check can report a false failure despite direct clean-copy validation passing. | For RC2 freshness proof, use the direct Docker clean copy including `.hadara`, or fix the wrapper in a follow-up. |
