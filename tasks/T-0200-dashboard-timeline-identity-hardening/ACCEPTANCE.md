# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Evidence timeline events use semantic evidence id where available. | Done | Timeline evidence events now use normalized evidence `id` as event id and `evidenceId`. |
| AC-2 | Timeline exposes fingerprint/sourceLine/idStability when available. | Done | Event fields include `evidenceFingerprint`, `evidenceSourceLine`, `evidenceIdSource`, and `evidenceIdStability`. |
| AC-3 | `artifact-N` ids are fallback-only. | Done | Focused test asserts normal evidence events do not use `artifact-` evidence ids. |
| AC-4 | No private raw paths are exposed. | Done | Timeline still uses sanitized summaries and focused test checks `.hadara/local` is absent. |
| AC-5 | Schema and focused tests pass. | Done | Focused Docker tests passed with 3 files / 16 tests. |
