# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm view hadara@0.3.2 version --registry=https://registry.npmjs.org` | Verify stable package registry visibility. | Yes | Passed | returned `0.3.2`; `ev:T-0341:3208efa9002b47cc8ea68363` |
| `npm dist-tag ls hadara --registry=https://registry.npmjs.org` | Verify stable and rc dist-tags. | Yes | Passed | `latest=0.3.2`, `next=0.3.2-rc.0`; `ev:T-0341:3208efa9002b47cc8ea68363` |
| `npm --prefix "$tmp" install hadara@latest` | Install published stable package into disposable temp prefix. | Yes | Passed | temp-prefix install passed; `ev:T-0341:3208efa9002b47cc8ea68363` |
| `"$tmp/node_modules/.bin/hadara" version --json` | Verify installed package version and dist freshness. | Yes | Passed | `packageVersion:"0.3.2"`, `build.distLooksStale:false`; `ev:T-0341:3208efa9002b47cc8ea68363` |
| Installed `init` / `evidence list` / `evidence add-command --resolves` smoke | Verify stable package Evidence v2 workflow from consumer path. | Yes | Passed | durable id `ev:T-0001:779b4482e58b47818385bdb3` resolved; `ev:T-0341:3208efa9002b47cc8ea68363` |
| Installed minimal task lifecycle smoke | Verify stable package task create/evidence/ready/close/audit workflow. | Yes | Passed | disposable fixture reached `closed-valid`; `ev:T-0341:3208efa9002b47cc8ea68363` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Source checkout full test suite | No | No source code changes are planned; T-0341 validates the already-published package. | Not Run | Not applicable for verification-only package recycle. |
| Temp cleanup check | Yes | Recycle artifacts must stay disposable and outside the repo. | Passed | temp prefix/cache/project removed; `ev:T-0341:3208efa9002b47cc8ea68363` |
