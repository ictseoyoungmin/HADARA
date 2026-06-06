# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara@0.2.0-rc.0` installs in `hadara-recycle` toy project via npm. | Done | `npm view`, `npm install`, and installed `version --verbose --json` passed. |
| AC-2 | A toy project is initialized and representative HADARA interfaces are exercised. | Done | `FINDINGS.md` interface matrix. |
| AC-3 | Findings include pass/fail behavior, bugs, good points, and improvement opportunities. | Done | `FINDINGS.md`. |
| AC-4 | No publish/deploy mutation or token loading is performed. | Done | Release/package/install surfaces used dry-run/read-only modes only. |
| AC-5 | Evidence and handoff/state updates are recorded. | Done | T-0271 evidence and docs updates. |
