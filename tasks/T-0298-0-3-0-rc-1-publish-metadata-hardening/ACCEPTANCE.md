# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Source package version and user-facing release docs target `hadara@0.3.0-rc.1`. | Done | `package.json`, `package-lock.json`, `README.md`, `docs/RELEASE_READINESS.md`. |
| AC-2 | Manual publish helper prefers `node dist/cli/main.js` over global `hadara`. | Done | `scripts/release/manual-publish-rc.sh`; `tests/unit/manual-publish-script.test.ts`. |
| AC-3 | Manual publish helper validates tarball package metadata before npm publish dry-run/execute. | Done | `scripts/release/manual-publish-rc.sh`; `tests/unit/manual-publish-script.test.ts`. |
| AC-4 | Focused tests cover the publish helper guard and affected README version expectation. | Done | Docker focused tests passed 3 files / 31 tests. |
| AC-5 | Release artifact/package metadata smoke proves the generated rc.1 tarball contains description, keywords, repository, homepage, and bugs metadata. | Pending | TBD |
| AC-6 | Evidence is attached and handoff/state docs are updated. | Pending | TBD |
