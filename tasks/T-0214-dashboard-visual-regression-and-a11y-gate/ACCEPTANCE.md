# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Visual baselines are captured and compared in Docker for key views/states. | Done | scripts/dashboard-visual-check.sh captured home/detail/empty/degraded. |
| AC-2 | No critical/serious accessibility violations; contrast targets met. | Done | axe-core pass after --faint fix. |
| AC-3 | Forbidden storage/mutation/private-path/command-exec scans still pass. | Done | dashboard-static.test.ts forbidden-token + source scans. |
| AC-4 | Full Docker validation is green. | Done | npm ci && build && vitest: 84 files / 562 tests. |
