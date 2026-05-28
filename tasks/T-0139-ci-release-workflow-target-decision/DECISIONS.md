# Decisions

Record task-local design decisions here.

- Initial release target: npm package.
- Secondary release target: GitHub Release containing the release tarball, checksum, and manifest after npm package readiness is proven.
- Deferred release target: Docker image, because HADARA's current product surface is a Node CLI/workbench rather than a hosted server runtime.
- Required token names are documentation-only in this capsule: `NPM_TOKEN` for npm publish and `GITHUB_TOKEN` or a scoped GitHub release token for GitHub Release creation.
- T-0140 should verify evidence freshness and artifact cross-checks before dry-run release scripts report readiness.
