# Context

- `docs/DEVELOPMENT_SLICES.md` lists T-0136 as Smoke Evidence Integration after T-0134 package smoke execution and T-0135 clean-checkout smoke execution.
- `docs/TEST_STRATEGY.md` requires public package-smoke evidence to be reduced UTF-8 summaries under `tasks/<task-id>/artifacts/package-smoke/` after redaction checks.
- T-0134 implemented explicit local package smoke with npm pack, isolated prefix install, installed `hadara doctor --json`, installed core smoke, cleanup, and reduced reports. It intentionally deferred evidence attachment.
- T-0135 implemented explicit clean-checkout smoke with disposable source copy, npm ci/build/check, built CLI doctor/status/strict release gate, cleanup, and reduced reports. It intentionally deferred evidence attachment.
- Public evidence artifacts must not include raw stdout/stderr, package contents, env secrets, private absolute paths, or private store paths.
- Preserve wording that package smoke installs into an isolated prefix, not a system global install.
