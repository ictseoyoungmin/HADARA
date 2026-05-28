# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/release-artifact.ts` | Add | Build staged release artifacts and reduced reports. |
| `package.json` | Update | Remove bootstrap skeleton wording from public package metadata. |
| `.gitignore` | Update | Ignore retained local release artifact output under `dist-release/`. |
| `src/cli/release-artifact.ts` | Add | Expose `hadara release artifact --execute --json`. |
| `src/cli/main.ts` | Update | Route and document the release artifact command. |
| `src/schemas/release-artifact.schema.json` | Add | Register `hadara.releaseArtifact.v1`. |
| `src/schemas/schema-index.json` | Update | Add the release artifact schema fixture. |
| `src/core/schema.ts` | Update | Register runtime schema validation for release artifact reports. |
| `src/services/capability-registry.ts` | Update | Advertise the explicit release artifact execution surface. |
| `tests/unit/release-artifact.test.ts` | Add | Cover execution guard, output artifacts, reduced report, and whitelist failure. |
| `tests/unit/schema-runtime.test.ts` | Update | Cover release artifact schema validation and mutation/privacy rejection. |
| `tests/unit/schema-fixtures.test.ts` | Update | Keep schema index fixture expectations aligned. |
| `tests/unit/tools-list.test.ts` | Update | Cover capability discovery for release artifact builder. |
| `tasks/T-0137-release-artifact-builder/*` | Update | Record capsule scope, evidence, and handoff. |
| `docs/PROJECT_STATE.md` | Update | Record implemented release artifact builder. |
| `docs/RELEASE_READINESS.md` | Update | Document retained artifact output boundary and manifest schema follow-up. |
| `docs/SCHEMAS.md` | Update | Document pending smoke evidence summary and release artifact manifest schema fixtures. |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark T-0137 done after validation. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Update | Mark T-0136/T-0137 release sequencing as complete in backlog. |
| `docs/TASK_BOARD.md` | Update | Move T-0137 to Done after validation. |
| `docs/AGENT_HANDOFF.md` | Update | Hand off T-0138 evidence-freeze work and schema note. |
