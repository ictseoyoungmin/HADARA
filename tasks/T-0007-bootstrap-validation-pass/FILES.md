# Files

| Path | Action | Reason |
|---|---|---|
| package-lock.json | Added | Make dependency installation reproducible for local Docker runs and CI. |
| .github/workflows/ci.yml | Added | Run `npm ci` and `npm run check` on push and pull request. |
| src/task/task-capsule.ts | Updated | Align new Task Capsule `EVIDENCE.md` schema with append behavior. |
| src/evidence/evidence.ts | Reviewed | Confirm append behavior already writes the 4-column evidence schema. |
| src/cli/main.ts | Updated | Fix strict TypeScript handling of the evidence summary fallback. |
| tests/harness/task-capsule.test.ts | Updated | Cover the 4-column evidence schema and append behavior. |
| docs/AGENT_HANDOFF.md | Updated | Record current bootstrap validation handoff. |
