# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Default package recycle plan/execute path omits broad `context graph --json`. | Done | `ev:T-0423:5205a44ac4f546f28d15ae49`; `ev:T-0423:b1c67ff5ac4540b5930c3d5f` |
| AC-2 | Explicit opt-in can include `context graph --json` for full diagnostics. | Done | `ev:T-0423:5205a44ac4f546f28d15ae49`; focused test coverage in `tests/unit/package-recycle.test.ts`. |
| AC-3 | Installed subprocess environment does not force `HADARA_PROJECT_ROOT` to the source workspace. | Done | `ev:T-0423:cd03a65c043f42848901fab0`; no stray post-T-0423 task capsule was created during execute smoke. |
| AC-4 | Default installed smoke includes version, help lifecycle, init, session start, task lifecycle, task finalize dry-run, context pack `--task`, context slice, and cleanup. | Done | `ev:T-0423:b1c67ff5ac4540b5930c3d5f` |
| AC-5 | Focused tests pass. | Done | `ev:T-0423:cd03a65c043f42848901fab0` |
| AC-6 | Workspace `dist` is refreshed after source changes. | Done | `ev:T-0423:cd03a65c043f42848901fab0` |
| AC-7 | Built helper dry-run/smoke verifies the default fast profile shape. | Done | `ev:T-0423:5205a44ac4f546f28d15ae49` |
| AC-8 | Handoff/shared docs are updated before finalize. | Done | T-0423 handoff, Task Board, Project State, Development Slices, Release Readiness, and Agent Handoff updated. |
