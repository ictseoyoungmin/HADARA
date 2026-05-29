# Decisions

- Treat README cleanup as a documentation-only release-candidate slice. It may describe the published npm RC and existing CLI surfaces, but it must not add or imply installer, USB portable, GitHub Release, Docker image, provider, shell execution, or broad MCP write behavior.
- Prefer installed CLI verification examples that match current release readiness docs, especially `hadara doctor --json`.
- Keep source-checkout development instructions separate from npm package usage so users do not confuse local development with installed package validation.
