# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0485:c541e1fabdc54b35a1be92e5 | passed | validation | Container ext4 validation passed: npm ci, focused timing/script/validation/task/release/package checks (9 files / 67 tests), TypeScript build, and full npm run check (150 files / 993 tests); workspace dist refreshed from the passing build. |
| ev:T-0485:c2aaa91b5fa74d5bb063085d | passed | validation | Root cause confirmed and smoke checked: T-0479 dogfood negative durations came from run_flowforge_dogfood.sh using separate wall-clock Date.now probes; the harness now uses process.hrtime.bigint with nonnegative clamping, CLI elapsed helpers use startMonotonicTimer, bash -n passed, task status diagnostics emitted durationMs 72, and git diff --check passed. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0485:f5e9021b6b2f4db5b2839441 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0485:b203788f8f424a42ae06a771 | blocked | Validation "Timing smoke" blocked; blocked because validation command could not be launched (EPERM): spawnSync node EPERM; command: node -e process.exit(0) --json; exitCode: 9; signal: null; durationMs: 12; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:460f4c88dce2754eecbb9e1d642088280b66b90a9cf0598be2fb2f005b3581cb | Resolved | ev:T-0485:c541e1fabdc54b35a1be92e5 |
<!-- /hadara:slot -->
