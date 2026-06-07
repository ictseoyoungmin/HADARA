# HADARA 0.2.0-rc.2

Release candidate for the npm package after init scaffold lifecycle and protocol guidance hardening.

## Highlights

- Refreshes generated `hadara init` docs for the current task workflow, evidence integrity, project-specific document registration, and direct harness validation diagnostics.
- Adds common multi-language local artifact hygiene to generated `.gitignore`, including Python virtualenv/cache/SQLite patterns used by dogfooding projects.
- Clarifies close-source stability before `task close` to reduce repeated close/audit churn from post-close documentation edits.
- Updates npm package metadata and user-facing install guidance for `hadara@0.2.0-rc.2`.

## Boundaries

- npm publish is operator-confirmed through `scripts/release/manual-publish-rc.sh T-0282 --execute`.
- Python bridge publishing is separate; the current preview bridge remains `hadara==0.2.0rc1`.
- Docker image publishing, installer execution, and MCP release/package execution remain deferred.
