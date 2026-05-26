# Tests

## Required

- Docker focused TUI validation:

```bash
docker exec hadara-dev bash -lc 'rm -rf /tmp/hadara && mkdir -p /tmp/hadara && tar --exclude=node_modules --exclude=dist -cf - -C /workspace . | tar -xf - -C /tmp/hadara && cd /tmp/hadara && npm ci >/dev/null && npx vitest run tests/unit/tui-cache.test.ts tests/unit/tui-cli.test.ts tests/unit/tui-terminal.test.ts && npm run build'
```

This focused suite covers source-signal invalidation for new/deleted tasks, Task Board-only changes, selected evidence detail refresh, private-evidence cache disable, and fast validation hash reuse.

- Docker full validation:

```bash
docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run check'
```

- Docker done-level harness validation:

```bash
docker exec hadara-dev bash -lc 'cd /tmp/hadara && node dist/cli/main.js harness validate --task T-0109 --level done --json --project /workspace'
```

## Optional

- 1000-capsule benchmark:

```bash
docker exec hadara-dev bash -lc 'cd /tmp/hadara && node - <<'"'"'NODE'"'"'
...
NODE'
```
