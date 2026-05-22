# Context

T-0031 extracted init and run scaffold helpers from `src/cli/main.ts`, reducing it from 667 to 459 LOC. The next cohesive command group is `harness`, which already has domain logic in `src/harness/validate.ts` and `src/harness/replay.ts`.

This task extracts only CLI orchestration for the harness group.
