# Decisions

- Use `hadara release artifact --execute --json` instead of extending `release gate`; the gate must remain read-only.
- Stage a minimal package before `npm pack` so the artifact is whitelist-shaped even while the root `package.json` is still bootstrap-stage and lacks a final `files` whitelist.
- Keep `private: true` in the staged package. T-0137 verifies local artifact shape only; publishability remains a later owner-approved transition.
- Generate checksums and manifest files next to the tarball, but keep default output disposable. Operators can use `--output <dir>` for explicit retained local files.
- Treat manifest file entries as metadata, not raw package contents; raw tarball contents are not printed in public JSON.
- Use release-facing package description text in staged package metadata: `HADARA: portable agentic development workbench`.
- Keep `dist-release/` ignored because it is the recommended retained local artifact directory.
