# Plan

1. Read required HADARA protocol docs, roadmap slice notes, and active capsule files.
2. Define `hadara.write.preflight.v1` and CLI command boundaries.
3. Implement a shared report builder for task/evidence/handoff/run-state/debt write families.
4. Add CLI routing for `hadara write preflight <command...> --json`.
5. Add focused report and CLI tests.
6. Run Docker validation.
7. Attach evidence, update acceptance, board, state, slices, and handoff.
