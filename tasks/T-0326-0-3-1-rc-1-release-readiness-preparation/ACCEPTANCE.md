# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `package.json`, `package-lock.json`, built `dist` version metadata, README, release notes, release readiness docs, helper guidance, and relevant tests target `hadara@0.3.1-rc.1`. | Done | Package metadata, helper docs, release docs, tests, and Docker build/version smoke target `0.3.1-rc.1`. |
| AC-2 | README release status stays package-page concise and links version text to `docs/RELEASE_NOTES.md`. | Done | README Release Status links stable/RC version text to `docs/RELEASE_NOTES.md`; init README test updated. |
| AC-3 | Release readiness evidence is refreshed: Docker sync-build, release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and `git diff --check`. | Done | T-0326 evidence records and attached artifacts record all required checks. |
| AC-4 | No actual publish/deploy mutation runs in T-0326. | Done | Release artifact, package smoke, clean-checkout smoke, release dry-run, and publish dry-run report no publish/GitHub/Docker mutation. |
| AC-5 | Shared state docs point next to T-0327 approval-gated publish and T-0328 post-publish recycle. | Done | Project State, Agent Handoff, Development Slices, Release Readiness, and Task Board point to T-0327/T-0328 boundaries. |
| AC-6 | T-0326 close-source docs are finalized for ready/close/audit without storing volatile close evidence inside close-source fields. | Done | `task finish --execute`; this acceptance table and HANDOFF are finalized before ready/close. |
