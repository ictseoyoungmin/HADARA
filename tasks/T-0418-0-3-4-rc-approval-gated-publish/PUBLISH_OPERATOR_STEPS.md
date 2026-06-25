# T-0418 Publish Operator Steps

Use this only after reviewing T-0417 readiness and T-0418 pre-publish evidence.

## Prepared Environment

The prepared publish clone is inside the Docker container:

```bash
docker exec -it hadara-dev bash
cd /root/hadara-publish
```

The clone is on ext4, not the mounted `/workspace` filesystem. It was prepared at commit `d349586` and built with `packageVersion` `0.3.4-rc.0`.

## Pre-Publish Checks

Run these before publishing if the shell has been idle:

```bash
git status --short
node dist/cli/main.js version --json
node dist/cli/main.js release gate --mode strict --json
node dist/cli/main.js release publish --mode dry-run --json
npm view hadara@0.3.4-rc.0 version --registry=https://registry.npmjs.org
npm view hadara dist-tags --json --registry=https://registry.npmjs.org
```

Expected before publish:

- `git status --short` is empty.
- `packageVersion` is `0.3.4-rc.0`.
- strict release gate is `ok:true`.
- publish dry-run is `ok:true` with approval/token warnings only.
- `npm view hadara@0.3.4-rc.0 version` returns npm `E404`.
- dist-tags are `latest=0.3.3` and `next=0.3.3-rc.0`.

## Publish

Authenticate if needed:

```bash
npm login --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org
```

Publish with the helper:

```bash
bash scripts/release/manual-publish-rc.sh T-0418 --execute
```

When prompted, type exactly:

```text
publish
```

Do not pass `--github-draft` for this capsule unless a separate approval explicitly requests it.

## Post-Publish Verification

After publish, verify:

```bash
npm view hadara@0.3.4-rc.0 version --registry=https://registry.npmjs.org
npm view hadara dist-tags --json --registry=https://registry.npmjs.org
```

Expected after publish:

- `npm view hadara@0.3.4-rc.0 version` returns `0.3.4-rc.0`.
- `next` is `0.3.4-rc.0`.
- `latest` remains `0.3.3`.

Copy or sync the T-0418 publish evidence from `/root/hadara-publish/tasks/T-0418-0-3-4-rc-approval-gated-publish/` back into the source workspace before closing the capsule.
