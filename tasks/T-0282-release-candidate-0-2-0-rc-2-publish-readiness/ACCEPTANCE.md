# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `package.json`, `package-lock.json`, README, release notes, release readiness docs, and manual helper examples target npm `hadara@0.2.0-rc.2`. | Done | File review plus package metadata checks. |
| AC-2 | Optional GitHub Release draft note exists for `0.2.0-rc.2`. | Done | `GITHUB_RELEASE_NOTE.md`. |
| AC-3 | Docker build/check passes and workspace `dist` is refreshed from Docker output. | Done | Docker `npm run dev:docker-sync-build` passed 100 files / 681 tests and synced `dist`. |
| AC-4 | Built CLI reports package version `0.2.0-rc.2` and release/readiness dry-run surfaces remain non-mutating. | Done | Built `version --verbose`, strict release gate, package smoke, clean-checkout smoke, npm pack dry-run, and release dry-run blocked only on clean-worktree release artifact evidence. |
| AC-5 | No npm publish, GitHub Release/tag push, Docker publish, PyPI/TestPyPI publish, or installer/MCP release execution runs in this capsule. | Done | Evidence privacy/mutation flags and command history. |
| AC-6 | Evidence is attached and handoff/current-state docs identify the exact operator publish command. | Done | T-0282 evidence plus handoff/release readiness docs. |
