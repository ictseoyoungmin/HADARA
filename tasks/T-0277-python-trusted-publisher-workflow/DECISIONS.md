# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0277-1 | Use a manual `workflow_dispatch` workflow instead of push/tag/release triggers. | Accepted | The operator asked to try Trusted Publisher, but publish must remain explicit and not happen on ordinary repository pushes. | `.github/workflows/python-publish.yml`. |
| D-0277-2 | Use separate GitHub environments named `testpypi` and `pypi`. | Accepted | PyPI docs say environment configuration is optional but strongly encouraged; separate environments allow stricter approval on real PyPI. | PyPI Trusted Publisher docs, workflow jobs. |
| D-0277-3 | Build once, then publish the uploaded artifact through target-specific jobs. | Accepted | Keeps test/build/twine check consistent before upload and makes the OIDC publish job small. | `.github/workflows/python-publish.yml`. |
