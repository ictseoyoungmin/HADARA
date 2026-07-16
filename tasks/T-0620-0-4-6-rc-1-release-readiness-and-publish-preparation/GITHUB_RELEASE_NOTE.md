# HADARA 0.4.6-rc.1

HADARA 0.4.6-rc.1 is a release-candidate refresh after published 0.4.6-rc.0. It focuses on installed-package dogfood findings, safe concurrent Task Capsule creation, first-user documentation workflow cleanup, and faster HADARA-dev Docker dist refresh before a stable 0.4.6 decision.

## Highlights

- Validates the published rc.0 package through installed-package dogfood across multiple scenarios, including delegated toy projects and a larger Quant Battle Arena planning/development scenario.
- Serializes task id allocation and managed Task Board writes so external agents may request task creation concurrently while HADARA applies the actual write safely.
- Keeps fresh init scaffolds smaller and adds `hadara docs add <type>` for optional project-owned docs:
  - `architecture`
  - `decisions`
  - `roadmap`
  - `security-model`
  - `test-strategy`
  - `agent-guide`
- Updates generated workflow and AGENTS guidance so agents keep generated/project-owned `docs/` files current when work changes their subject.
- Splits HADARA-dev Docker helper behavior:
  - `npm run dev:docker-sync-build` is now a fast minimal build/dist-refresh path with stage timings.
  - `npm run dev:docker-check` remains the full validation path.

## Validation

- Focused task-create serialization, docs-add/init, schema/help, and Docker helper tests passed during the rc.1 preparation line.
- TypeScript builds passed.
- Docker fast sync-build refreshed `dist` and built CLI smoke reported `distLooksStale=false`.
- Release package smoke and strict release gate are part of the T-0620 source/readiness capsule.

## Boundaries

- This is a prerelease candidate intended for npm `next`.
- Stable npm `latest` remains `hadara@0.4.5` until a later stable promotion.
- npm publish, GitHub Release publication, token loading, and installed-package recycle remain operator-controlled steps after this source/readiness capsule.
- Post-publish recycle should install `hadara@next` and verify expected version `0.4.6-rc.1`.
