# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm --cache /tmp/hadara-npm-cache view hadara@0.3.2-rc.0 version dist-tags --json` | Verify registry visibility and dist-tags. | Yes | Passed | version `0.3.2-rc.0`; `latest=0.3.0`; `next=0.3.2-rc.0` |
| `npm --cache /tmp/hadara-npm-cache --prefix /tmp/hadara-t0338-recycle/prefix install hadara@0.3.2-rc.0` | Install published package into disposable prefix. | Yes | Passed | added 1 package |
| `/tmp/hadara-t0338-recycle/prefix/node_modules/.bin/hadara version --json` | Verify installed package version from prefix bin. | Yes | Passed | `packageVersion: "0.3.2-rc.0"` |
| Installed `hadara evidence list` text and JSON workflow | Verify durable id/category/outcome/tags surfaces. | Yes | Passed | text list showed `[ev:T-0001:05029b568eb84972838e4b79] ... validation/failed`; JSON exposed id/idSource/idStability/persistedSchemaVersion/category/outcome/tags |
| Installed `hadara evidence add-command --resolves ev:T-0001:05029b568eb84972838e4b79` | Verify exact durable-id resolution workflow. | Yes | Passed | appended passed evidence with `tags:["resolves:ev:T-0001:05029b568eb84972838e4b79"]` |
| Installed fresh init/docs smoke | Verify generated docs surface from package. | Yes | Passed | governed init created context/docs registry docs; `docs required-reading`, `docs list`, and `init doctor` returned `ok:true` |
| Installed disposable lifecycle smoke | Verify package lifecycle commands. | Yes | Passed | `task ready` and `harness validate` returned `ok:true`; `task close --execute` appended close evidence; `task audit-close` returned `closed-valid` |
| Temp folder cleanup check | Verify disposable install/project/cache cleanup. | Yes | Passed | `find /tmp/hadara-t0338-recycle /tmp/hadara-npm-cache ...` returned no paths |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Exact `npx hadara@0.3.2-rc.0 version --json` | Optional convenience smoke. | No | Environment Finding | Resolved stale fnm/global shim and reported `packageVersion: "0.3.0-rc.2"`; canonical prefix bin proof passed |
| Security smoke | No | No security boundary changed. | Not Applicable | T-0338 scope |
| Integration smoke | No | No MCP/Hermes integration changed. | Not Applicable | T-0338 scope |
