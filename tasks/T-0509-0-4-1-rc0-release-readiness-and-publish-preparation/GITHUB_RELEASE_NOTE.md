# HADARA 0.4.1-rc.0

`0.4.1-rc.0` is a release-candidate cleanup line after stable `0.4.0`. It focuses on dogfood-reported command-surface friction, generated-project correctness, and safer low-ceremony Task Capsule closure.

## Highlights

- `task finalize --execute --auto` is now the ordinary guarded close path for clean capsules. It keeps dry-run review semantics internally, refuses blockers without writes, and still aborts if the close-source plan changes before execution.
- Schema/vocabulary lookup and docs-registry correction paths reduce trial-and-error around TASK.md, evidence, and docs controlled tokens.
- Generated init docs, help routing, session-start guidance, validation wrapper behavior, and package/release help surfaces were hardened after fresh-project dogfood.
- Package smoke now checks command-surface drift so a published package cannot silently expose CLI commands that differ from the source registry/routing surface.
- Obsolete compatibility surfaces and low-level lifecycle public commands were removed or redirected with structured `replacementCommand` fields.
- `validation run --direct-result` lets agents record an already-run validation result when wrapper process spawning is blocked by the environment.
- The first bounded state-first prototype for `DEVELOPMENT_SLICES.md` is included without adopting the full 0.5 state-first RFC.

## Boundaries

- npm publish uses the `next` dist-tag. Stable `latest` remains `hadara@0.4.0` until a later stable promotion decision.
- This RC does not publish Docker images, PyPI packages, installers, or MCP release artifacts.
- Removed command redirect stubs are kept where specified so automation can migrate from `replacementCommand` rather than failing on unknown commands.
- GitHub Release publication remains operator-controlled after npm publish verification.

## Suggested Install

```bash
npm install -g hadara@0.4.1-rc.0
hadara doctor --json
```

