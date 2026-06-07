# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `package.json`, `package-lock.json`, README, release notes, release readiness docs, and manual helper examples target npm `hadara@0.2.0-rc.2`. | Done | File review plus package metadata checks. |
| AC-2 | Optional GitHub Release draft note exists for `0.2.0-rc.2`. | Done | `GITHUB_RELEASE_NOTE.md`. |
| AC-3 | Docker build/check passes and workspace `dist` is refreshed from Docker output. | Done | Docker `npm run dev:docker-sync-build` passed 100 files / 681 tests and synced `dist`. |
| AC-4 | Built CLI reports package version `0.2.0-rc.2` and release/readiness dry-run surfaces pass before helper-mediated publish. | Done | Built `version --verbose`, strict release gate, package smoke, clean-checkout smoke, npm pack dry-run, release artifact refresh, and helper dry-runs passed. |
| AC-5 | npm publish runs only through the approval-gated helper; no GitHub Release/tag push, Docker publish, PyPI/TestPyPI publish, or installer/MCP release execution runs in this capsule. | Done | Helper publish evidence verifies npm view returned `0.2.0-rc.2`; GitHub draft requested false. |
| AC-6 | Evidence is attached and handoff/current-state docs identify the completed operator publish and remaining optional release paths. | Done | T-0282 evidence plus handoff/release readiness docs. |
