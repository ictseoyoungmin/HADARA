# T-0143 Manual RC Npm Publish

## Goal

Support and record a manual npm-only publish flow for `hadara@0.1.0-rc.0`, with dry-run evidence first and GitHub Release draft automation prepared but not used in this capsule.

## Scope

- Run the manual RC publish helper in dry-run mode from the prepared container.
- Attach fresh package-smoke, clean-checkout, and release-artifact evidence to T-0143.
- Fix manual helper ergonomics discovered during dry-run.
- Add a task-local GitHub Release note file and wire the helper to accept it with `--github-release-note`.
- Support GitHub CLI authentication through existing `gh` auth, `GH_TOKEN`, or a token environment variable name passed by `--github-token-env`.
- Execute npm publish only with `scripts/release/manual-publish-rc.sh T-0143 --execute` and the explicit interactive `publish` confirmation.

## Out of Scope

- Publishing a GitHub Release or pushing git tags.
- Linux/WSL install script implementation.
- Windows install script implementation.
- USB portable install/launcher implementation.
- README release/install documentation cleanup.
- Storing token values or secrets in repository files, logs, evidence, or release notes.
- Docker image publishing.

## Status

Done
