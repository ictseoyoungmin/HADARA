# Acceptance Criteria

- [x] `hadara release artifact --execute --json` builds a tarball, checksum, and manifest without publish, GitHub Release, or Docker image behavior.
- [x] The package is staged from a whitelist, and reported package contents reject files outside `dist/`, `README.md`, `LICENSE`, and `package.json`.
- [x] The report is schema-valid as `hadara.releaseArtifact.v1`, uses redacted paths, and excludes raw logs, raw package contents, private paths, private store paths, environment secrets, publish, and release mutation.
- [x] Default output is disposable; explicit `--output <dir>` is supported and clearly marked as local output.
- [x] Capability discovery reports the release artifact builder as an explicit release execution surface.
- [x] Docker focused tests, full check, built CLI artifact smoke, strict release gate, and done-level harness validation are recorded.
