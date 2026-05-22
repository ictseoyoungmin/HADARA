# Context

The current CLI accepts file paths for evidence artifacts, replay scenarios, scripted provider steps, and fake shell fixtures. Some call sites use `path.resolve(projectRoot, input)` and then read or copy without proving the resolved realpath stays inside the project root.

Relevant files:

- `src/evidence/evidence.ts`
- `src/harness/replay.ts`
- `src/cli/main.ts`
- `src/core/paths.ts`
- `tests/unit/evidence-json.test.ts`
- `tests/harness/harness-replay.test.ts`

The previous path resolver already has `isInside()` with realpath-aware containment. T-0023 adds a CLI-file-input-oriented layer on top.
