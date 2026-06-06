# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Package metadata targets `hadara@0.2.0-rc.1` and does not depend on a previous `hadara` package. | Pending | `package.json`, `package-lock.json`, package smoke evidence. |
| AC-2 | README, release notes/readiness docs, and manual publish helper examples point to rc.1 and T-0275. | Pending | Docs diff and focused README/release checks. |
| AC-3 | Fresh package smoke, clean-checkout smoke, release artifact, release dry-run, and release publish dry-run evidence exists under T-0275. | Pending | T-0275 `EVIDENCE.md`, `evidence.jsonl`, public artifacts. |
| AC-4 | No npm publish, registry mutation, GitHub Release creation, Docker image build, PyPI upload, token loading, or publish execute path is run by this agent. | Pending | Evidence summaries and release publish dry-run mutation flags. |
| AC-5 | After this capsule is done and committed, the operator can run `npm login` and then `scripts/release/manual-publish-rc.sh T-0275 --execute` to publish the exact tarball after the helper's own confirmation prompt. | Pending | Manual helper syntax check, release evidence, and handoff instructions. |
| AC-6 | Task workflow ready/finish/close/audit passes and handoff/project state docs are updated. | Pending | Lifecycle command reports. |
