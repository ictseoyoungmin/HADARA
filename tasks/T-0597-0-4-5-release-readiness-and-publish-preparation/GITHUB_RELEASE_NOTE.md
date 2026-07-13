# HADARA 0.4.5

HADARA 0.4.5 focuses on safe brownfield adoption and docs-registry cleanup.

## Highlights

- Adds docs-registry v3 with clearer lifecycle, role, origin, and profile applicability semantics.
- Adds safe brownfield `hadara init` adoption: existing projects get a zero-write plan first, then require `--adopt --execute --plan-hash <hash>` to write HADARA-managed files.
- Preserves project-authored docs during adoption instead of treating existing files as scaffold drift.
- Removes generated `tasks/.gitkeep` and keeps init scaffolds aligned with the current public command surface.
- Hardens docs-registry mutation commands so failed mutations exit non-zero.
- Validates fresh `basic`/`standard`/`governed` init, governed lifecycle close, brownfield execute, and fail-closed adoption safety paths.

## Boundaries

This release prepares npm `latest` publication for `hadara@0.4.5`. npm publish and GitHub Release publication remain operator-approved actions. Post-publish installed-package recycle should be handled in a follow-up capsule after publication.
