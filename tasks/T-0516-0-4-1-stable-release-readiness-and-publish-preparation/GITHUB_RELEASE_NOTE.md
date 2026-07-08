# HADARA 0.4.1

Stable release for the 0.4.1 dogfood hardening line after `0.4.1-rc.0` prerelease publication, installed-package recycle, helper refactor, and post-recycle adaptive dogfood.

## Highlights

- Promotes `task finalize --execute --auto` as the ordinary guarded close path while preserving dry-run review, close-source hashing, blocker refusal, and stale-plan mismatch protection.
- Keeps removed low-level lifecycle surfaces behind structured redirect stubs with `replacementCommand` fields, while `task status` and `task finalize` own the primary lifecycle.
- Adds schema/vocabulary lookup, stronger controlled-token diagnostics, and docs-registry correction paths.
- Improves restricted-environment validation through `validation run --direct-result`.
- Adds package-smoke command-surface drift checks and package recycle behavior that adapts to the installed command surface.
- Promotes the bounded `DEVELOPMENT_SLICES.md` state/projection prototype as 0.4.x scope, without adopting the full 0.5 state-first RFC.

## Verification Line

- `0.4.1-rc.0` was published on npm with `next` and released as a public GitHub prerelease.
- RC installed-package recycle passed from consumer paths.
- Post-refactor adaptive recycle dogfood verified that package recycle uses `task status` and does not fall back to removed `task lifecycle` when the installed command surface supports the current path.
- Stable source preparation in T-0516 retargeted metadata/docs to `0.4.1` and leaves npm/GitHub publication as explicit operator actions.

## Boundaries

- npm publish uses the `latest` tag for `0.4.1`.
- Docker image publish, PyPI publish, installer execution, MCP release/package execution, and full 0.5 state-first adoption remain out of scope.
- After publish, run a separate installed-package recycle capsule against `hadara@latest` expected `0.4.1`.
