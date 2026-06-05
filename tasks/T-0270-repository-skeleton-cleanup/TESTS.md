# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `rg -n 'START[.]bat|start[.]sh|hadara[.]cmd|[.]/hadara' README.md docs scripts src tests tasks package.json .github examples` | Confirm active references are historical/planned portable context only, not current root launcher entrypoints. | Yes | Passed | Found only T-0270 docs plus portable/historical references. |
| `git diff --check` | Detect whitespace and patch hygiene issues. | Yes | Passed | No output. |
| `node -e "const p=require('./package.json'); console.log(JSON.stringify({bin:p.bin,files:p.files},null,2))"` | Confirm package entrypoint/files metadata does not depend on root launchers. | Yes | Passed | `bin.hadara` points to `./dist/cli/main.js`; package files are `dist/`, `README.md`, `LICENSE`, `package.json`. |
| `npm pack --dry-run --json --cache /tmp/hadara-npm-cache-t0270` | Verify package contents after cleanup without publishing. | Yes | Passed | Produced `hadara-0.2.0-rc.0.tgz` dry-run metadata with 189 package entries. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker suite | No | Deleting unused root convenience launchers does not change runtime code. | Not Run | Focused cleanup checks are sufficient because package metadata and runtime code did not change. |
| Publish smoke | No | This capsule must not publish or mutate registries. | Not Run | T-0269 owns approval-gated publish work. |
