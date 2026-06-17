# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prepare source metadata and package-facing docs for stable `hadara@0.3.2` before running publish dry-runs. | Accepted | T-0339 selected stable publish; npm package versions are immutable, so dry-runs should inspect the stable version tarball before any registry mutation. | T-0339 D-2; T-0340 PLAN |
| D-2 | Reuse `scripts/release/manual-publish-rc.sh` for stable publish preparation because non-rc versions default to npm `latest`. | Accepted | The helper name is historical; its tag resolver chooses `next` only for `*-rc.*` and `latest` otherwise. | `scripts/release/manual-publish-rc.sh` |
