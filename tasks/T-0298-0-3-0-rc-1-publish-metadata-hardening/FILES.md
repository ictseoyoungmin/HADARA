# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `package.json` | Edit | Bump current RC version to `0.3.0-rc.1`. | Done |
| `package-lock.json` | Edit | Keep lock metadata aligned with package version. | Done |
| `README.md` | Edit | Present rc.1 as current package-facing install target and note rc.0 metadata caveat. | Done |
| `docs/RELEASE_READINESS.md` | Edit | Track rc.1 as current source publish candidate. | Done |
| `scripts/release/manual-publish-rc.sh` | Edit | Prefer built workspace CLI and block incomplete tarball metadata. | Done |
| `tests/unit/manual-publish-script.test.ts` | Add | Regression coverage for helper behavior. | Done |
| `tests/unit/init.test.ts` | Edit | Align package-facing README expectation with rc.1. | Done |
| `dist/` | Refresh | Keep built workspace CLI aligned with rc.1 source. | Done |
