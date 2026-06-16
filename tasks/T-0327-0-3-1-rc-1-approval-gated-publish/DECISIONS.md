# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat npm dist-tag correction as part of T-0327 close readiness. | Accepted | The package publish succeeded, but an RC on `latest` changes default install behavior and conflicts with stable `0.3.0` positioning. | `command:T-0327:dist-tag-drift-observed` |
| D-2 | Default future rc publishes in `manual-publish-rc.sh` to npm tag `next`, while stable versions default to `latest`. | Accepted | npm publish defaults to `latest`; prerelease helpers need an explicit tag default so operator confirmation does not accidentally move stable install traffic to an RC. | `command:T-0327:manual-publish-tag-hardening` |
| D-3 | Close T-0327 only after registry dist-tags verify `latest=0.3.0` and `next=0.3.1-rc.1`. | Accepted | Registry visibility alone is not enough for an rc publish if default install traffic points at the RC. | `command:T-0327:npm-dist-tag-corrected` |
