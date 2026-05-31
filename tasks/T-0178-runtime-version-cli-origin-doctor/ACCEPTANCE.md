# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara version --verbose --json` emits `hadara.runtime.version.v1`. | Done | Built CLI smoke evidence. |
| AC-2 | Report includes cli entry, cwd, project root, package version, git branch/head, build freshness, and Node version. | Done | `tests/unit/runtime-version.test.ts`; built CLI smoke evidence. |
| AC-3 | Runtime version schema is registered and validated by tests. | Done | `src/schemas/runtime-version.schema.json`; schema fixture tests. |
| AC-4 | Phase 3.5 operator workflow hardening plan is reflected in docs. | Done | `docs/ROADMAP.md`; `docs/DEVELOPMENT_SLICES.md`. |
| AC-5 | Evidence, handoff, and close audit are recorded. | Done | T-0178 evidence and handoff. |
