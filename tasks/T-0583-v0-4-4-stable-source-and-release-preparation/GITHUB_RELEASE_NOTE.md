# HADARA 0.4.4

Stable release for the 0.4.4 external/delegated dogfood and generated-document currentness line.

## Highlights

- Promotes the `0.4.4-rc.0` line after npm/GitHub prerelease publication, installed-package recycle, stable-promotion verification, and final major CLI dogfood.
- Keeps the fresh-project UX fixes validated across delegated/basic, external/standard, and Claude-governed dogfood runs.
- Improves generated project behavior around version aliases, stale installed-package diagnostics, bootstrap next-work retirement, consumer context-pack guidance, finish-only status hints, and governed handoff scaffolds.
- Uses existing `package.json` metadata during `hadara init` while preserving `docs doctor` warnings for projects that leave product metadata unset after completed task history exists.
- Fixes a final state-projection false positive from T-0582: legacy `docs/DEVELOPMENT_SLICES.md` is not treated as latest-task authority unless canonical `.hadara/state/slices.json` exists.

## Validation

- `0.4.4-rc.0` was published and recycled from `hadara@next`.
- T-0581 rechecked npm/GitHub RC metadata and installed-package recycle before stable promotion.
- T-0582 exercised major CLI paths before stable: repo read models, `commands`, `help`, `schema`, `docs doctor`, `status`, `task status`, release diagnostics, fresh `basic`/`standard`/`governed` init, and a governed toy lifecycle through validation evidence and `task finalize --execute --auto`.
- T-0582 fix validation passed focused state-projection tests, TypeScript build, Docker full suite, `docs doctor`, and `status --state-only`.

## Boundaries

- This stable release does not add provider execution, a cloud service, scheduler/background runner, vector retrieval, dashboard productization, installer execution, Docker image publishing, PyPI publishing, or MCP release/package mutation.
- Post-publish installed-package recycle for `hadara@latest` expected `0.4.4` remains the next follow-up after npm/GitHub publication.
