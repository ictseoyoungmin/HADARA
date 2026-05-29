# Decisions

- `hadara release publish --mode dry-run|execute --json` is the public command surface for this slice.
- The first implementation is intentionally a readiness/reporting surface, not a mutation-capable publisher.
- Execute mode is reserved for an explicit approval path but remains blocked before any publish/deploy side effect.
- Token checks report only `NPM_TOKEN`, `HADARA_GITHUB_RELEASE_TOKEN`, or `GITHUB_TOKEN` presence booleans; token values are never copied into public output.
- Private audit is written only for execute-mode requests, using the existing portable audit store.
- Docker image publishing remains deferred.
