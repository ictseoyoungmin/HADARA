# T-0478 0.4.0-rc.0 publish env safe-directory fix

## Identity

| Field | Value |
|---|---|
| ID | T-0478 |
| Title | 0.4.0-rc.0 publish env safe-directory fix |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| `scripts/release/prepare-publish-env.sh` | implementation-source | implementation-source | implemented | sha256:bf75efefe7a3264f3849461d973b5de3b7e808d5fa800c58e24ff01d6cb3e4b7 | Publish environment helper that failed while cloning `/workspace`. |
| `tests/unit/manual-publish-script.test.ts` | implementation-source | implementation-source | implemented | sha256:9b458353c6be1d6f58eab01656414724e97bd056e4c22f92ee86b29c5ad19e6e | Existing release helper regression test file. |

## Goal

| Goal | Notes |
|---|---|
| Make the 0.4.0-rc.0 publish environment helper tolerate Git dubious ownership for the mounted repo. | The operator should be able to rerun `bash scripts/release/prepare-publish-env.sh T-0477` and reach the npm-login/manual-publish handoff without the `/workspace/.git` safe.directory failure. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the task contract around the observed safe.directory clone failure. | Done | This TASK.md |
| 2 | Harden the publish preparation script before `git clone /workspace`. | Done | `ev:T-0478:0890480f746f4a788b3dcb25` |
| 3 | Add focused regression coverage and run the helper smoke. | Done | `ev:T-0478:ddc3565699d04e1b8e9faa1c`, `ev:T-0478:0890480f746f4a788b3dcb25` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | `prepare-publish-env.sh` registers both the mounted worktree path and mounted `.git` path as safe directories before cloning. | Yes | Met | `ev:T-0478:0890480f746f4a788b3dcb25` | Required | User report |
| AC-2 | The release helper regression test covers the mounted `.git` safe-directory ordering. | Yes | Met | `ev:T-0478:ddc3565699d04e1b8e9faa1c` | Required | `tests/unit/manual-publish-script.test.ts` |
| AC-3 | The operator-facing preparation command no longer fails at the reported clone step in the `hadara-dev` container. | Yes | Met | `ev:T-0478:0890480f746f4a788b3dcb25` | Required | `scripts/release/prepare-publish-env.sh` |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Shell syntax | `bash -n scripts/release/prepare-publish-env.sh scripts/release/manual-publish-rc.sh` | Yes | Passed | `ev:T-0478:b6bfce23a3ef4dcca669aa46` |
| Focused unit test | `npm run test -- tests/unit/manual-publish-script.test.ts --run` | Yes | Passed | `ev:T-0478:ddc3565699d04e1b8e9faa1c`; host environment failure `ev:T-0478:3d5d9e72e1ba45bc93115b2c` resolved by `ev:T-0478:1d8c31ecd2134975b56d4ebf` |
| Container helper smoke | `bash scripts/release/prepare-publish-env.sh T-0477 --skip-dry-run` | Yes | Passed | `ev:T-0478:0890480f746f4a788b3dcb25` |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| `scripts/release/prepare-publish-env.sh` | publish helper | Add an idempotent safe-directory helper and register `/workspace/.git` before cloning. | Fix observed Git dubious ownership failure. | `ev:T-0478:0890480f746f4a788b3dcb25` |
| `tests/unit/manual-publish-script.test.ts` | release tests | Add focused regression assertion for safe-directory registration before clone. | Prevent accidental removal of the clone preflight. | `ev:T-0478:ddc3565699d04e1b8e9faa1c` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Actual npm publish remains operator-controlled under T-0477 after this helper fix is committed. | Open | `docs/AGENT_HANDOFF.md` |
