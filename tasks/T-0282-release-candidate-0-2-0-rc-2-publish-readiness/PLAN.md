# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project and release docs. | Done | `AGENTS.md`, handoff, Task Board, package metadata, release docs, and manual helper reviewed. |
| 2 | Bump npm package metadata and release docs to `0.2.0-rc.2`. | Done | `package.json`, `package-lock.json`, README, release docs, and helper examples target rc2. |
| 3 | Build and validate in Docker, then refresh workspace `dist`. | Done | Docker `npm run dev:docker-sync-build` passed 100 files / 681 tests and reported packageVersion `0.2.0-rc.2`, `distLooksStale:false`. |
| 4 | Run built-CLI release/readiness smokes without publish mutation. | Done | Version smoke, strict release gate, package smoke, clean-checkout smoke, npm pack dry-run, and pre-publish npm registry E404 check completed. |
| 5 | Run the approval-gated manual helper after commit and npm authentication. | Done | Helper regenerated release artifact/package/clean evidence, published `hadara@0.2.0-rc.2`, verified npm view returned `0.2.0-rc.2`, and skipped GitHub draft. |
| 6 | Attach evidence and update handoff/current-state docs. | Done | T-0282 evidence and docs updated. |
