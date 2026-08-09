# RC3 Release Readiness

## Status

Active RC3 pre-operator readiness contract. Owner: T-0759.

## Boundary

This capsule prepares a releasable `0.5.0-rc.3` source state and verifies all read-only or disposable release gates. It does not publish to npm, create or edit a GitHub Release, or recycle an installed package from a public registry.

## Required Gates

| Gate | Requirement | Evidence boundary |
|---|---|---|
| Source | `package.json`, lockfile, README, release readiness, and release note metadata target `0.5.0-rc.3`. | Current committed source and capsule evidence |
| Artifact | A clean source checkout produces tarball, checksum, and manifest. | Reduced report plus operator-retained exact files |
| Provenance | Package smoke must use `--from <exact-tarball>` and its SHA-256 must equal the release artifact tarball hash. | Public package-smoke and release-artifact evidence |
| Consumer | Disposable clean-checkout smoke runs install, build, full check, doctor, task status, and strict gate. | Public clean-checkout evidence |
| Readiness | Strict release gate, release dry-run, and publish dry-run pass without mutation. | Read-only reports |

## Artifact Retention

The exact tarball used for package smoke, its checksum, and manifest remain in the operator release workspace until npm and GitHub secondary uploads finish. Capsule evidence stores reduced metadata only; no binary artifact is committed.

## Operator Handoff

After this capsule is `closed-valid`, the operator capsule may run the reviewed publish helper against the retained exact artifact, verify npm `next` resolves `0.5.0-rc.3`, attach the same tarball/checksum/manifest to the GitHub prerelease, and then run installed consumer recycle in a fresh project. Any post-publish fix requires a new RC source line.

## Acceptance

- The source and release note identify `0.5.0-rc.3` without changing immutable RC2 records.
- Release artifact, checksum, and manifest are produced from a clean source checkout.
- Package smoke receives the exact release tarball and provenance hash equality passes.
- Clean-checkout smoke and full repository validation pass.
- Strict release gate, release dry-run, and publish dry-run pass with no external mutation.
- A GitHub release note and exact operator command sequence are present in the capsule.
