# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `docs/RELEASE_READINESS.md` no longer says T-0338 installed-package recycle is active. | Done | Targeted `rg` found the corrected complete-through-T-0338 line and no active-in-T-0338 line. |
| AC-2 | Tests or explicit constraints are recorded. | Done | `TESTS.md` records docs-only validation and out-of-scope package/registry checks. |
| AC-3 | Evidence is attached. | Done | `ev:T-0339:c13115df6d8e471791753886` |
| AC-4 | Handoff is updated. | Done | Task-local handoff and `docs/AGENT_HANDOFF.md` updated. |
| AC-5 | Temporary docker-compose backend/frontend dogfood project is created and exercised with HADARA. | Done | `/tmp/hadara-dogfood-asteroid-ops`; T-0001 reached `closed-valid`; `ev:T-0339:49cceff9e094481a85b7b4b0`. |
| AC-6 | Structured dogfooding findings are recorded in T-0339. | Done | `FINDINGS.md`; `ev:T-0339:49cceff9e094481a85b7b4b0`. |
| AC-7 | Stable/rc1/defer decision is explicit. | Done | Stable `0.3.2` publish selected in `DECISIONS.md` D-2. |
| AC-8 | Stable publish follow-up capsule is created. | Done | T-0340 `tasks/T-0340-stable-0-3-2-approval-gated-publish`; `ev:T-0339:c99adfd72cb447e69f60a072`. |
