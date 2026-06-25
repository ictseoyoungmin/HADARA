# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Publish `hadara@0.3.4-rc.0` with npm dist-tag `next`. | Accepted | RC versions must not replace stable `latest`; helper defaults rc versions to `next`. | scripts/release/manual-publish-rc.sh |
| D-2 | Do not create a GitHub Release draft in this capsule by default. | Accepted | npm is the primary release target; GitHub Release is secondary and approval-gated separately. | docs/RELEASE_READINESS.md |
| D-3 | Prepare publish from the container ext4 clone, not mounted `/workspace`. | Accepted | Mounted workspace has known npm/build latency and symlink issues; helper docs recommend `/root/hadara-publish`. | scripts/release/prepare-publish-env.sh |
