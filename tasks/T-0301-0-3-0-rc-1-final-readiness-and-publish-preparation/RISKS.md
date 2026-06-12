# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Operator uses the old T-0297 rc.0 capsule id for rc.1 publish. | Evidence would attach to the wrong capsule and repeat rc.0 release confusion. | Medium | Helper now verifies the task capsule contains the package version and rejects T-0297 for `0.3.0-rc.1` before npm auth. | Mitigated |
| Dry-run leaves release evidence/artifacts and blocks immediate `--execute`. | Operator command sequence would fail clean-worktree preflight after a successful dry-run. | High | Helper cleans only generated release outputs on dry-run success and can clean the same allowed outputs at preflight. | Mitigated |
| README claims rc.1 is installable before npm publish. | Public users could copy a non-existent install command. | Medium | README was updated after npm view verified rc.1, so install examples now target the published package. | Mitigated |
| rc.1 tarball metadata omits npm discovery fields. | npm search/discovery remains weak and repeats rc.0 metadata gap. | Low | Existing tarball metadata guard blocks publish when description, keywords, repository, homepage, or bugs are missing. | Mitigated |
| Actual npm publish mutates the registry. | Irreversible package version publication. | Certain if executed | Operator executed the helper after dry-run/readiness checks; evidence records npm publish and npm view verification. | Completed |
