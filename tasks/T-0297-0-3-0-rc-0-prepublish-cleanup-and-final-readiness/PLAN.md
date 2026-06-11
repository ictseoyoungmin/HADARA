# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and reviewer feedback. | Done | `AGENTS.md`, project state/handoff/task board/SOP, active capsule docs, release/test docs, pasted feedback. |
| 2 | Update README package-facing release/install text, package metadata, and lifecycle wording. | Done | `README.md`, `package.json`, focused docs/release tests pending. |
| 3 | Fix stale T-0296 handoff and rerun T-0296 close checks. | Done | T-0296 ready passed; close execute appended superseding close evidence; audit-close returned closed-valid. |
| 4 | Remove duplicate Phase 7 bundle docs and keep `docs/specs/0.3.0/` canonical. | Done | Deleted `docs/specs/phase7_surface_refactor/`. |
| 5 | Run final readiness validation and attach evidence. | Done | Focused tests, Docker sync build, package smoke, Docker clean-checkout smoke, release artifact, strict release gate, release dry-run, and publish dry-run passed; host clean-checkout npm ci failed and was recorded. |
| 6 | Finish/ready/close/audit T-0297 and commit. | Done | Task finish executed; ready passed; close evidence appended; audit-close returned closed-valid. |
