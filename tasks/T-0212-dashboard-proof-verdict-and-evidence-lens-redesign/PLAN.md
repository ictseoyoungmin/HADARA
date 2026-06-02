# Plan

| Step | Status | Evidence |
|---|---|---|
| Normalize task detail (proof, evidence, commands) defensively. | Done | model.ts normalizeTaskDetail. |
| Build the ProofVerdict card and EvidenceList. | Done | ui.tsx ProofVerdict/EvidenceList. |
| Keep private-only as a warning, surface semantic issue codes. | Done | proof-audit + issue-codes render. |
| Verify proof verdict renders on selection. | Done | Visual gate detail; T-0206 -> SUFFICIENT. |

## Post-Review Fix Pass (2026-06-02)

| Finding | Fix | Evidence |
|---|---|---|
| F-4 proof verdict lacked a drill affordance | `ProofVerdict` now renders a "View evidence ↓" link that scrolls to `#capsule-evidence`. | Playwright probe: `.proof-drill` present on selection. |
