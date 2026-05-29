# Acceptance Criteria

- [x] Fresh package-smoke, clean-checkout, and release-artifact evidence is attached to T-0143.
- [x] npm tarball dry-run uses a local file path and passes without publishing.
- [x] GitHub Release draft notes live in this Task Capsule.
- [x] `scripts/release/manual-publish-rc.sh` accepts `--github-release-note <path>`.
- [x] GitHub token handling can use a named environment variable without writing the token to repo files.
- [x] Full manual helper execution reached npm publish after the release note option change.
- [x] npm publish is executed with `--execute` and explicit `publish` confirmation.
- [x] GitHub Release draft, git tag push, Linux/WSL install scripts, Windows install scripts, USB install scripts, and README cleanup are not performed in this capsule.
- [x] Handoff is finalized before marking this capsule Done.
