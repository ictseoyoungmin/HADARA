# Decisions

- Keep the default helper mode as dry-run.
- Require `--execute` plus an interactive `publish` confirmation before actual npm publish.
- T-0143 is npm-only for actual mutation: run `scripts/release/manual-publish-rc.sh T-0143 --execute` without `--github-draft`.
- Require `--execute --github-draft` plus an interactive `github-draft` confirmation before GitHub Release draft creation.
- Store GitHub Release draft notes in `tasks/T-0143-manual-rc-publish-dry-run/GITHUB_RELEASE_NOTE.md`.
- Use `--github-release-note <path>` to pass release notes to `gh release create --notes-file`.
- Do not accept raw GitHub token values as positional arguments. Use existing `gh` auth, `GH_TOKEN`, or `--github-token-env <ENV_NAME>`.
- Defer Linux/WSL, Windows, and USB install scripts plus README release/install cleanup to the next capsule.
