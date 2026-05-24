# Tests

## Required

- `docker ps --filter name=^/hadara-dev$`
- `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build >/dev/null && node dist/cli/main.js harness validate --task T-0071 --level done --json --project /workspace'`

## Optional

- Full `npm run check` if code changes are introduced.
