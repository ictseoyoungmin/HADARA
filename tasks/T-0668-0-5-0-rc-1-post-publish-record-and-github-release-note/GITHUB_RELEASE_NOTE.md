# HADARA 0.5.0-rc.1

Release candidate follow-up for the 0.5 status-ingress and continuation hardening line.

## What changed since 0.5.0-rc.0

- Hardened task close recovery action boundaries and blocked-status precedence.
- Added project-level continuation persistence after task close so selected next work is not silently lost when `nextWork` is null.
- Fixed stale bootstrap `nextWork` retirement by using origin tracking instead of title matching.
- Added `anyOf` support to the schema validator; prior support was effectively a silent no-op.
- Fixed the known "no follow-up work" continuation contradiction by classifying matching handoff text as terminal rather than actionable.
- Promoted package metadata and release docs to `0.5.0-rc.1`.
- Recycled release readiness from a freshly pulled Docker image and rebuilt `hadara-dev` environment.

## Validation

- Docker sync build passed from a freshly recreated `hadara-dev` container.
- Package smoke passed for `hadara@0.5.0-rc.1` with the release timeout profile.
- Clean-checkout smoke passed.
- Release artifact generation passed from a clean ext4 clone.
- Strict release gate passed.
- Release dry-run returned ready with blockers 0.
- Publish dry-run returned ok with token warnings only before the operator-approved npm publish.
- npm registry verification after publish returned `hadara@0.5.0-rc.1`, with `next=0.5.0-rc.1` and `latest=0.4.6`.

## Release boundary

- npm package: published as `hadara@0.5.0-rc.1` on the `next` dist-tag.
- Stable package remains `hadara@0.4.6` on `latest`.
- Docker image publishing remains deferred.
- GitHub Release publication remains operator-controlled; this note is the release-note artifact for `v0.5.0-rc.1`.

## Known follow-ups

- Run and record installed-package recycle from `hadara@next` expected `0.5.0-rc.1`.
- Fix release workflow design debt found during the rc1 recycle: source/evidence root coupling, self-invalidating artifact evidence flow, natural-language continuation disposition, and missing release-note artifact contract.
