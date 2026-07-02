# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0478:b6bfce23a3ef4dcca669aa46 | passed | validation | bash -n scripts/release/prepare-publish-env.sh scripts/release/manual-publish-rc.sh passed |
| ev:T-0478:ddc3565699d04e1b8e9faa1c | passed | validation | docker ext4 temp clone with patched files: npm ci and npm run test -- tests/unit/manual-publish-script.test.ts --run passed (4 tests) |
| ev:T-0478:0890480f746f4a788b3dcb25 | passed | validation | bash scripts/release/prepare-publish-env.sh T-0477 --skip-dry-run passed: clone from /workspace, npm ci, build, strict release gate, clean final worktree |
| ev:T-0478:1d8c31ecd2134975b56d4ebf | passed | validation | resolves:ev:T-0478:3d5d9e72e1ba45bc93115b2c container ext4 focused release-helper test passed after host vitest absence |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0478:09f91c03a11c40fd97b9db91 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0478:3d5d9e72e1ba45bc93115b2c | failed | npm run test -- tests/unit/manual-publish-script.test.ts --run failed on host because local node_modules/vitest is absent; reran in container ext4 clone | Resolved | ev:T-0478:1d8c31ecd2134975b56d4ebf |
<!-- /hadara:slot -->
