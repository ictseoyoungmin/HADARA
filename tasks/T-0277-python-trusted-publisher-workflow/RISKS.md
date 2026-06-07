# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Workflow publishes accidentally on push. | Could upload an unintended package. | Medium | Use `workflow_dispatch` only; no `push`, tag, release, or PR trigger. | Mitigated; static trigger check passed. |
| PyPI Trusted Publisher fields do not match workflow identity. | Publish job fails with OIDC trust error. | Medium | Document exact owner, repository, workflow filename, and environment names. | Mitigated; runbook records the matching values, but the external PyPI/TestPyPI setup still must use them exactly. |
| PyPI package name is not reserved until first pending-publisher publish. | Another user could claim the name between setup and first publish. | Low | Operator should run TestPyPI/PyPI publish soon after pending publisher setup if name reservation matters. | Open; this is an external registry timing risk until first real PyPI publish. |
| Real PyPI publish is dispatched before TestPyPI smoke. | Could publish an unverified bridge package version. | Medium | Default workflow target is `testpypi`; docs instruct TestPyPI first and environment protection for `pypi`. | Mitigated; workflow default and docs steer TestPyPI first. |
| Repository stores PyPI credentials. | Secret leakage or long-lived token exposure. | Low | Use OIDC Trusted Publishing with no checked-in tokens and no PyPI secret requirements. | Mitigated; workflow has no PyPI token/password fields. |
