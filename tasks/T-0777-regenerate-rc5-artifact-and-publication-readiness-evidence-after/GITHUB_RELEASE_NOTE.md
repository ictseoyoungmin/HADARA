# HADARA v0.5.0-rc.5

HADARA 0.5.0-rc.5 is an unpublished prerelease candidate following the T-0776 exact evidence-artifact binding hardening.

## Highlights

- Public evidence artifacts now retain exact SHA-256 and byte-length metadata, verify integrity during lint, and fail closed on changed same-key retries.
- Release operator reports use observed npm dist-tags and distinguish stable/latest mutation truthfully.
- The RC5 package was built from source commit `e3ac410e` and validated from one retained release input.

## Validation

The exact RC5 tarball passed isolated package smoke, clean-checkout smoke, strict release gate, release dry-run, and publish dry-run. No npm, GitHub, Docker-image, or public-consumer mutation occurred during readiness preparation.

## Release boundary

- This is a prerelease for npm dist-tag `next`.
- Stable npm `latest` remains `0.4.6`.
- GitHub prerelease publication is a separate reviewed operator action.
- The retained tarball, checksum, and manifest must be uploaded without rebuilding.
- Public consumer recycle follows publication in a separate capsule.
- No tokens or machine-local absolute paths are included in this note.
