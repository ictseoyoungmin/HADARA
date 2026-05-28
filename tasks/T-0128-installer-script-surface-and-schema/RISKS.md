# Risks

| Risk | Mitigation |
|---|---|
| Installer contract accidentally becomes install implementation. | Do not create installer scripts, launchers, symlinks, profile edits, package copies, or execution paths in T-0128. |
| Release gate starts executing installer checks. | Keep the gate read-only over `docs/RELEASE_READINESS.md` and schema fixture registration. |
| Windows and WSL behavior is conflated. | Document Windows native, WSL Linux Node, and USB mount paths as distinct surfaces. |
| Installer output leaks private paths, environment values, npm tokens, or raw logs. | Define reduced JSON reports and private/local raw-log boundaries before implementation. |
| Install-plan schema allows raw target path strings in public output. | Require `target.prefix` and `target.launcher` to be redacted public path-reference objects and add runtime schema regressions for raw string rejection. |
| `mode: execute` in the schema is mistaken for permission to mutate installs. | Document execute as schema-reserved only and require T-0129 dry-run implementation to reject execute mode or return `INSTALL_EXECUTION_DISABLED`. |
| New readiness details worsen `TEST_STRATEGY.md` marker fragility. | Put T-0128+ details in `docs/RELEASE_READINESS.md` and keep `TEST_STRATEGY.md` as high-level validation guidance. |
| npm account/token questions block this design capsule. | Keep package registration/publish credentials out of scope until explicit publish/deploy capsules. |
| Host npm/Node validation gives misleading results. | Use Docker temp-copy validation and record exact results in task evidence. |
