# Handoff

## Last Completed

Manual RC dry-run reached npm tarball dry-run after refreshing package-smoke, clean-checkout, and release-artifact evidence. The initial tarball dry-run failed because npm interpreted `dist-release/...tgz` as a package/git spec. The helper now normalizes local tarball paths to `./dist-release/...tgz`, and direct container verification of `npm publish ./dist-release/hadara-0.1.0-rc.0.tgz --dry-run --registry=https://registry.npmjs.org` passed without publishing.

Manual npm publish for `hadara@0.1.0-rc.0` was then run from `hadara-rc-dryrun` with `scripts/release/manual-publish-rc.sh T-0143 --execute` and the explicit `publish` confirmation. npm initially rejected publish without 2FA, then browser/OTP authentication succeeded. Registry verification returned:

- `name = 'hadara'`
- `version = '0.1.0-rc.0'`
- `dist.tarball = 'https://registry.npmjs.org/hadara/-/hadara-0.1.0-rc.0.tgz'`

The helper now supports:

- `--github-release-note <path>` for `gh release create --notes-file`.
- `--github-token-env <ENV_NAME>` to authenticate `gh` from an environment variable without storing token values.

The release note file is `tasks/T-0143-manual-rc-publish-dry-run/GITHUB_RELEASE_NOTE.md`.

Current operator decision: this capsule will perform npm publish only. Do not pass `--github-draft` for T-0143. GitHub Release draft creation, git tag push, Linux/WSL install scripts, Windows install scripts, USB install scripts, and README release/install cleanup are deferred to the next capsule.

## Next Recommended Step

Start a later capsule for user install and release documentation work: Linux/WSL install scripts, Windows install script, USB portable install/launcher flow, README release/install cleanup, and optional GitHub Release draft/tag work. Treat T-0143 as npm-publish-only; do not retroactively add GitHub Release or installer mutations to this capsule.
