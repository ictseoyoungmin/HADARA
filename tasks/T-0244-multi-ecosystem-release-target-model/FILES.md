# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/release-targets.ts` | Add | Central release target descriptors and npm/Python manifest detectors. | Done |
| `src/services/release-dry-run.ts` | Update | Use descriptor model for package metadata and release target report output. | Done |
| `src/schemas/release-dry-run.schema.json` | Update | Allow descriptor array with ecosystem metadata. | Done |
| `tests/unit/release-dry-run.test.ts` | Update | Cover npm/GitHub/Docker descriptors and Python preview detector. | Done |
| `src/services/package-smoke.ts` | Update | Add npm provider metadata to package smoke reports. | Done |
| `src/schemas/package-smoke.schema.json` | Update | Allow npm provider metadata in package smoke reports. | Done |
| `tests/unit/package-smoke-dry-run.test.ts` | Update | Cover provider metadata in dry-run and local reports. | Done |
| `docs/RELEASE_READINESS.md` | Update | Document current npm-primary state and preview-only multi-ecosystem model. | Done |
| `docs/PROJECT_STATE.md` | Update | Reflect descriptor-backed release dry-run and npm-specific smoke. | Done |
| `docs/SCHEMAS.md` | Update | Document descriptor/provider schema meaning. | Done |
