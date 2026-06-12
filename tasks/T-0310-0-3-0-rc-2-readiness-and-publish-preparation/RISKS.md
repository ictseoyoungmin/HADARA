# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release mutation accidentally enters a read-model slice. | Could publish or expose tokens unexpectedly. | Medium | Keep publish/token/registry actions out of scope and prove dry-run flags in tests. | Mitigated: release publish dry-run reports no publish/GitHub/Docker mutation; no execute publish was run. |
| README implies rc.2 is already published. | Users could try to install an unpublished npm version. | Medium | Keep install examples on `hadara@0.3.0-rc.1` until publish evidence exists and label rc.2 as source candidate. | Mitigated: README distinguishes published rc.1 and source rc.2. |
| Release artifact guard blocks evidence refresh while the worktree is dirty. | Artifact/package readiness evidence cannot be refreshed from uncommitted edits. | High | Run source validation first, then commit source readiness if needed before release artifact refresh, or record blocker honestly. | Mitigated: source readiness was committed first so release artifact could run from a clean HEAD; final evidence/docs are amended into the same T-0310 commit. |
| Host npm environment blocks clean/package smokes. | Required smoke commands can fail for cache or npm CLI reasons unrelated to source. | Medium | Use `/tmp` npm cache or Docker ext4 validation path and record failed attempts honestly. | Mitigated: package smoke passed with `/tmp` npm cache; clean-checkout smoke passed in Docker after host npm internal failure. |
