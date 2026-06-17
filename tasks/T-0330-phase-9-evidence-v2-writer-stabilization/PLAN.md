# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Evidence v2 stabilization context. | Done | Current-state docs, task workflow docs, Development Slices, Work Item B, and Evidence v2 migration plan read. |
| 2 | Add explicit Evidence v2 writer inputs for command evidence. | Done | `src/evidence/evidence.ts`, `src/cli/evidence.ts`, and `src/cli/evidence-json.ts` now carry explicit category/outcome/tags. |
| 3 | Update semantic resolution precedence for v2 records. | Done | `src/evidence/semantics.ts` now prefers exact resolution tags and keeps same-category fallback legacy-only. |
| 4 | Update operator docs/command metadata. | Done | CLI JSON contract, workflow docs, README, capability registry, and generated init text updated. |
| 5 | Run focused validation and attach evidence. | Done | Docker focused suite, full check/build/dist refresh, and built CLI smoke evidence recorded. |
| 6 | Finish lifecycle docs, shared state docs, and close. | Done | Capsule docs and shared state docs updated before finish/ready/close. |
