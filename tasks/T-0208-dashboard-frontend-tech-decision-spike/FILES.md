# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `dashboard/build.mjs` | Added | esbuild+preact bundle -> single inlined static asset with external-resource guard. | Done |
| `dashboard/index.template.html` | Added | Single-asset HTML template with inline CSS/JS/fallback placeholders. | Done |
| `scripts/dashboard-build.sh` | Added | Docker (node:22-bookworm) build runner; installs deps off-mount. | Done |
| `package.json` | Modified | Add esbuild/preact devDeps and dashboard:build scripts. | Done |
| `package-lock.json` | Modified | Lockfile updated for new devDeps. | Done |
| `docs/DECISIONS.md` | Modified | D-0011 records the approach-B decision and boundaries. | Done |
