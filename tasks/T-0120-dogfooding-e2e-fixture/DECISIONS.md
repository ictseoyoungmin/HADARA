# Decisions

- The dogfooding E2E fixture is a harness-level deterministic test, not a new public CLI command.
- The replay uses `createContextExportReport()` memory mode as the starting context export to avoid generated context-file mutation in the fixture.
- Policy continuity is represented by evaluating `npm run check` in auto mode and verifying the safe command decision without executing it.
- Policy outcome assertions use an explicit fixture-level state vocabulary: `allowed`, `requested`, and `blocked`, mapped to policy actions `allow`, `ask`, and `deny`.
- Evidence is attached through the evidence store with a public text artifact, so both `EVIDENCE.md` and `evidence.jsonl` are exercised.
- Done-level completion is proven by `validateTaskCapsule(..., { level: 'done' })` on the temporary Task Capsule.
- Built CLI dogfooding smoke is limited to JSON surfaces: `hermes export-context`, `task show`, `policy check-shell`, `evidence collect`, `evidence list`, `write preflight handoff update`, and `harness validate`.
