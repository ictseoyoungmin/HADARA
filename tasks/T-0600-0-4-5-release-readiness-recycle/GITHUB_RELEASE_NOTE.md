# HADARA 0.4.5

HADARA 0.4.5 focuses on safe brownfield adoption, docs-registry cleanup, and release-readiness hardening for existing projects.

## Highlights

- Adds docs-registry v3 with clearer lifecycle, role, origin, and profile applicability semantics.
- Adds safe brownfield `hadara init` adoption: existing projects get a zero-write plan first, then require explicit `--adopt --execute --plan-hash <hash>` before HADARA writes managed files.
- Fails closed for partial HADARA state, unsafe symlinks, malformed managed markers, path type mismatches, and non-HADARA `tasks/T-*` collisions.
- Detects meaningful single-file roots as brownfield projects, so small existing repos are not mistaken for greenfield.
- Preserves project-authored docs and existing managed-section ownership during adoption.
- Removes generated `tasks/.gitkeep` and keeps init scaffolds aligned with the current public command surface.
- Hardens docs-registry mutation commands so failed mutations exit non-zero.
- Validates fresh `basic`/`standard`/`governed` init, governed lifecycle close, installed-candidate brownfield adoption across TypeScript, Python/data, and web/monorepo shapes, plus fail-closed adoption safety paths.

## Boundaries

This release prepares npm `latest` publication for `hadara@0.4.5`. npm publish and GitHub Release publication remain operator-approved actions. Post-publish installed-package recycle should be handled in a follow-up capsule after publication.
