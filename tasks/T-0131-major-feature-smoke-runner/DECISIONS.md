# Decisions

- Use `hadara smoke run` as the shared command family for major-feature smoke rather than overloading package or release commands.
- Keep the first implemented profile as `core` only. It validates installed CLI read surfaces without package-smoke execution or strict evidence gates.
- Reserve `release-readiness` as a schema/CLI profile name, but make it fail closed with `FEATURE_SMOKE_PROFILE_DEFERRED` until package smoke, install matrix, and release artifact evidence exist.
- Emit reduced summaries rather than embedding raw subreports, raw TUI snapshots, raw logs, or private path data.
- Treat `hadara.featureSmoke.v1` as a fixture-level public contract with runtime validation in the shared report builder.
