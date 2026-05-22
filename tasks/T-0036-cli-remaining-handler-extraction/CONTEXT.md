# Context

T-0031 through T-0035 extracted init profile logic, run scaffold logic, harness, evidence, policy, Hermes, and handoff handling from `src/cli/main.ts`. The remaining command groups in `main.ts` are init, doctor, task, mcp, and run.

This task finishes the current extraction pass by leaving `main.ts` as the top-level dispatcher and preserving behavior through focused smokes.
