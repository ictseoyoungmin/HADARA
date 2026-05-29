# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-29T02:15:40.993Z | command-log | Package smoke local passed with reduced public evidence. (artifacts/package-smoke/2026-05-29T02-15-40.993Z-summary.json) | passed |
| 2026-05-29T02:16:49.438Z | command-log | Clean-checkout smoke passed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-05-29T02-16-49.438Z-summary.json) | passed |
| 2026-05-29T02:16:52.312Z | command-log | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. (artifacts/release-artifact/2026-05-29T02-16-52.312Z-report.json) | passed |
| 2026-05-29T02:19:26Z | command-log | Manual RC publish helper reached npm tarball dry-run, then failed because `npm publish dist-release/...tgz --dry-run` was interpreted as a package/git spec instead of a local file path. | failed |
| 2026-05-29T02:19:26Z | command-log | Patched `scripts/release/manual-publish-rc.sh` to pass local tarballs to npm as `./dist-release/...tgz`; container verification `npm publish ./dist-release/hadara-0.1.0-rc.0.tgz --dry-run --registry=https://registry.npmjs.org` passed without publishing. | passed |
| 2026-05-29T02:25:47Z | command-log | Added task-local GitHub Release notes and `--github-release-note` / `--github-token-env` helper options; `bash -n scripts/release/manual-publish-rc.sh` and helper `--help` passed. | passed |
| 2026-05-29T02:47:32.361Z | command-log | Package smoke local passed with reduced public evidence. (artifacts/package-smoke/2026-05-29T02-47-32.361Z-summary.json) | passed |
| 2026-05-29T02:48:03.419Z | command-log | Clean-checkout smoke passed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-05-29T02-48-03.419Z-summary.json) | passed |
| 2026-05-29T02:48:07.351Z | command-log | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. (artifacts/release-artifact/2026-05-29T02-48-07.351Z-report.json) | passed |
| 2026-05-29T03:06:39Z | command-log | npm publish completed for `hadara@0.1.0-rc.0`; registry verification returned package name `hadara`, version `0.1.0-rc.0`, and tarball URL `https://registry.npmjs.org/hadara/-/hadara-0.1.0-rc.0.tgz`. | passed |
