# Decisions

- The dogfooding E2E fixture is a harness-level deterministic test, not a new public CLI command.
- The replay uses `createContextExportReport()` memory mode as the starting context export to avoid generated context-file mutation in the fixture.
- Policy continuity is represented by evaluating `npm run check` in auto mode and verifying the safe command decision without executing it.
- Evidence is attached through the evidence store with a public text artifact, so both `EVIDENCE.md` and `evidence.jsonl` are exercised.
- Done-level completion is proven by `validateTaskCapsule(..., { level: 'done' })` on the temporary Task Capsule.
