# Tests

## Required

- `npm run check` in `hadara-rc-dryrun`.
- `scripts/release/manual-publish-rc.sh T-0143` dry-run through npm tarball dry-run.
- `npm publish ./dist-release/hadara-0.1.0-rc.0.tgz --dry-run --registry=https://registry.npmjs.org`.
- `bash -n scripts/release/manual-publish-rc.sh`.
- `scripts/release/manual-publish-rc.sh --help`.

## Optional

- Manual GitHub draft path with `--execute --github-draft --github-release-note tasks/T-0143-manual-rc-publish-dry-run/GITHUB_RELEASE_NOTE.md` after npm publish is intentionally confirmed.
