# Files

| Path | Action | Reason |
|---|---|---|
| `src/core/redaction.ts` | Update | Add reusable secret detection. |
| `src/evidence/evidence.ts` | Update | Enforce public artifact text and secret-scan policy. |
| `src/cli/evidence-json.ts` | Update | Return JSON issues for policy rejections. |
| `src/index.ts` | Update | Export evidence artifact policy error if needed. |
| `tests/unit/redaction.test.ts` | Update | Cover secret detection. |
| `tests/harness/task-capsule.test.ts` | Update | Cover public artifact policy and private no-copy behavior. |
| `tests/unit/evidence-json.test.ts` | Update | Cover JSON rejection for secret-bearing public artifacts. |
| `docs/SECURITY_MODEL.md` | Update | Document public artifact policy. |
| `docs/*.md` | Update | Record state, board, slices, and handoff. |
| `tasks/T-0024-evidence-artifact-redaction/*` | Add/Update | Task Capsule and evidence. |
