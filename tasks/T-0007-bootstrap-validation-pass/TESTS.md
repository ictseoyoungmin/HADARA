# Tests

## Required

- `docker run --rm -v /mnt/f/NowWorking/HADARA-dev:/workspace -w /tmp nikolaik/python-nodejs:python3.11-nodejs20 bash -lc 'cp -a /workspace/. /tmp/hadara && rm -rf /tmp/hadara/node_modules && cd /tmp/hadara && npm ci && npm run check'`

## Optional

- `npm run dev -- doctor`
- `npm run dev -- init`
- `npm run dev -- task create "bootstrap validation pass"`
- `npm run dev -- task list`
- `npm run dev -- task show T-0007`
- `npm run dev -- evidence collect --task T-0007 --summary "Docker bootstrap validation passed: npm ci and npm run check completed" --result passed`
- `npm run dev -- handoff update --task T-0007 --summary "Bootstrap validation task created; Docker npm ci and npm run check passed" --next "Review CI on GitHub Actions and track npm audit separately"`
