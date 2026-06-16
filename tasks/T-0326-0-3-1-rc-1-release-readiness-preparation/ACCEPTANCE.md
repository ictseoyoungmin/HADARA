# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `package.json`, `package-lock.json`, built `dist` version metadata, README, release notes, release readiness docs, helper guidance, and relevant tests target `hadara@0.3.1-rc.1`. | Pending | File review plus Docker build/version smoke. |
| AC-2 | README release status stays package-page concise and links version text to `docs/RELEASE_NOTES.md`. | Pending | README diff and init README test update. |
| AC-3 | Release readiness evidence is refreshed: Docker sync-build, release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and `git diff --check`. | Pending | T-0326 evidence records and attached artifacts. |
| AC-4 | No actual publish/deploy mutation runs in T-0326. | Pending | Publish dry-run output and release docs/handoff state. |
| AC-5 | Shared state docs point next to T-0327 approval-gated publish and T-0328 post-publish recycle. | Pending | Project State, Agent Handoff, Development Slices, Release Readiness. |
| AC-6 | T-0326 finishes, passes ready/close/audit, and is committed. | Pending | Lifecycle reports and git commit. |
