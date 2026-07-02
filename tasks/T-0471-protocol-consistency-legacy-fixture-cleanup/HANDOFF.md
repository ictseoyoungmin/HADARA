# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Protocol consistency task-level acceptance now reads current 0.4 `TASK.md` Acceptance when `ACCEPTANCE.md` is absent, while preserving legacy sidecar compatibility. | ev:T-0471:f1ba74206a9c4900a0dc68aa |
| Protocol consistency fixtures no longer assume removed default `FILES.md` or `ACCEPTANCE.md` files. | ev:T-0471:f1ba74206a9c4900a0dc68aa |
| Harness done-level guidance now shows current 0.4 TASK.md Acceptance examples instead of old sidecar-style rows. | ev:T-0471:f7a1d36929d7422fab03d9b9 |
| Docker build passed and `/workspace/dist` was refreshed from `/tmp/hadara/dist`. | ev:T-0471:0062866455bb449ebee07c0e |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Audit remaining legacy sidecar references in close/read-model/TUI/release-debt surfaces. | T-0471 fixed protocol consistency and harness guidance, but source search still shows intentional or stale references to `PLAN.md`, `FILES.md`, `ACCEPTANCE.md`, and other removed default sidecars in other modules. | `src/task/task-close.ts`, `src/services/evidence-lint.ts`, `src/services/release-closeout.ts`, `src/tui/read-model.ts`, `src/task/task-templates.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `protocol doctor --scope tasks --task T-XXXX` is invalid; task-scoped protocol smoke uses `protocol doctor --task T-XXXX --json`. | Agents can mis-record command failures as product failures. | Use task-scoped command form from the smoke evidence. |
| Global docs/profile diagnostics remain broad-scan heavy. | T-0470 optimized task-scoped close/finalize paths, but explicit full diagnostics may still be slow on mounted workspaces. | Keep as a separate performance capsule after legacy sidecar cleanup. |
