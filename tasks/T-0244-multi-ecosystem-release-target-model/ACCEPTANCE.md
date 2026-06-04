# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release dry-run exposes descriptor-backed release targets while preserving compatibility fields. | Passed | `npm run dev:docker-check`; built `release dry-run --json` showed npm/GitHub/Docker descriptors. |
| AC-2 | npm remains the active primary provider and package smoke reports identify `npm-package-smoke`. | Passed | `npm run dev:docker-check`; built `package smoke --dry-run --json` showed provider metadata. |
| AC-3 | `pyproject.toml` detection is read-only preview only and does not imply Python/PyPI execution support. | Passed | `tests/unit/release-dry-run.test.ts`; release readiness docs. |
| AC-4 | Operator docs state current npm-centric support and no PyPI/Docker/GitHub mutation expansion. | Passed | `docs/RELEASE_READINESS.md`, `docs/PROJECT_STATE.md`, `docs/SCHEMAS.md`. |
| AC-5 | Docker validation, sync-build, built CLI smokes, and whitespace check pass. | Passed | Evidence records and `git diff --check`. |
