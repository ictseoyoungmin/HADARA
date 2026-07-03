# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0492:50c4c3dc78a14861a165ad51 | passed | release | Fresh unmounted node:22-bookworm container installed hadara@0.4.0 globally; installed hadara version --json reported packageVersion 0.4.0; installed hadara package recycle --execute --package hadara@latest --expected-version 0.4.0 --json returned ok:true with latest=0.4.0, next=0.4.0-rc.0, isolated install/init/task/session/context/finalize smokes passed, and disposable workspace cleanup passed. |
| ev:T-0492:c5320beb448d46dcacfebf48 | passed | validation | Validation passed for T-0492: git diff --check exited 0 and harness validate --task T-0492 --level done --json returned ok:true with no issues. |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0492:2f49a7a5c382437dbac70a2c |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
