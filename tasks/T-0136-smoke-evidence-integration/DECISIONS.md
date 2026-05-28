# Decisions

- Use a shared `attachReducedSmokeEvidence()` helper instead of duplicating artifact/index writes in each smoke service. This keeps package-smoke and clean-checkout evidence summaries consistent.
- Store smoke evidence summaries under `artifacts/package-smoke/` and `artifacts/clean-checkout-smoke/` rather than the generic `artifacts/command-log/` directory, matching the release-smoke planning boundary.
- Keep dry-run package smoke read-only. T-0136 only attaches evidence from explicit local execution paths.
- Evidence summaries include source report schema/command/mode, execution flags, reduced step summaries, privacy flags, and reduced issue metadata. They do not include command stdout/stderr or raw package contents.
