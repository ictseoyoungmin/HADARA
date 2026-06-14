# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm view hadara@0.3.0-rc.2 version --registry=https://registry.npmjs.org` | Verify published package visibility. | Yes | Passed | Returned `0.3.0-rc.2`; initial sandbox run failed with `EAI_AGAIN`, approved network rerun passed. |
| `npm view hadara@0.3.0-rc.2 --json --registry=https://registry.npmjs.org` | Verify published package metadata. | Yes | Passed | Metadata included latest dist-tag `0.3.0-rc.2`, description, keywords, repository, homepage, bugs, tarball metadata, and version `0.3.0-rc.2`. |
| `npx -y hadara@0.3.0-rc.2 version --verbose --json` | Verify npx executes the published rc.2 package. | Yes | Passed | Reported `packageVersion: "0.3.0-rc.2"` and `distLooksStale:false`. |
| `npm install --prefix /tmp/hadara-t0312-install hadara@0.3.0-rc.2` plus installed-bin smokes | Verify temp-prefix installed package execution without mutating the operator global prefix. | Yes | Passed | Installed one package; installed bin returned rc.2 version, lifecycle help, and commands JSON. |
| Installed-bin fresh init/docs smokes | Verify first-run project docs and registry surfaces. | Yes | Passed | Basic init created context, `.hadara/docs-registry.json`, and `docs/DOC_REGISTRY.md`; doctor, required-reading tier output, and docs list passed. |
| Installed-bin `protocol migrate --target 0.3.0` dry-run/execute | Verify adoption migration execute from published package. | Yes | Passed | Execute created protocol marker, context, docs registry, DOC_REGISTRY, and COMMAND_SURFACE while preserving legacy task `evidence.jsonl`. |
| Installed-bin `task finish --execute` row preservation smoke | Verify T-0305 behavior survived packaging. | Yes | Passed | Preserved Task Board `Notes` value `human note` and extra `Owner` value `reviewer` while changing status to Done. |
| `git diff --check` | Check whitespace in repository changes. | Yes | Passed | No whitespace errors. |
| `node dist/cli/main.js harness validate --task T-0312 --level draft --json` | Validate capsule structure before finish. | Yes | Passed | Returned `ok:true` with no issues. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No MCP/Hermes or external integration behavior changed. | Not Run | Not applicable. |
| Full Docker suite | No | T-0312 is post-publish consumer recycle plus docs drift cleanup; no runtime source code changed. | Not Run | T-0310/T-0311 remain the current full/source validation baseline. |
