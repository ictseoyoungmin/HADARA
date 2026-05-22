# Files

| Path | Action | Reason |
|---|---|---|
| `src/core/workspace.ts` | Add | Shared resolver for project file inputs. |
| `src/evidence/evidence.ts` | Update | Guard public artifact source paths. |
| `src/cli/evidence-json.ts` | Update | Return JSON issues for rejected artifact paths. |
| `src/harness/replay.ts` | Update | Guard scenario JSONL reads. |
| `src/cli/main.ts` | Update | Guard run script/fixtures reads and validate `--max-steps`. |
| `src/index.ts` | Update | Export workspace helpers. |
| `tests/unit/workspace.test.ts` | Add | Unit coverage for traversal, absolute outside, and symlink escape. |
| `tests/unit/evidence-json.test.ts` | Update | JSON evidence rejection regression. |
| `tests/harness/harness-replay.test.ts` | Update | Replay path boundary regression. |
| `tests/unit/run-cli.test.ts` | Add | CLI JSON regressions for run input and maxSteps. |
| `docs/*.md` | Update | Record state, board, slices, and handoff. |
| `tasks/T-0023-workspace-file-boundary/*` | Add/Update | Task Capsule and evidence. |
