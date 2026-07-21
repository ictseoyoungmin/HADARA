# Installed Package Dogfood Report

## Scope

| Item | Value |
|---|---|
| Package | `hadara@next` |
| Expected version | `0.5.0-rc.1` |
| Environment | `hadara-dev` Docker container, `node:22-bookworm` |
| Install path | Temporary consumer prefix under `/tmp` inside the container |
| CLI entrypoint | Installed package `dist/cli/main.js` |

## Public Release Verification

| Check | Result |
|---|---|
| npm package version | `hadara@0.5.0-rc.1` returned `0.5.0-rc.1`. |
| npm dist-tags | `latest=0.4.6`, `next=0.5.0-rc.1`. |
| GitHub Release URL | `https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.5.0-rc.1` returned HTTP 200. |

## Installed Consumer Scenarios

| Scenario | Profile | Result | Checks |
|---|---|---|---|
| S1 | `basic` | Passed | `init --execute`, `task status`, `task create`, `context pack --task T-0001`, `docs doctor --scope all`. |
| S2 | `standard` | Passed | `init --execute`, `task status`, `task create`, `context pack --task T-0001`, `docs doctor --scope all`. |
| S3 | `governed` | Passed | `init --execute`, `task status`, `task create`, `context pack --task T-0001`, `docs doctor --scope all`. |
| S4 | package recycle | Passed | `package recycle --execute --package hadara@next --expected-version 0.5.0-rc.1 --json`; installed command surface exposed 75 command ids. |

## Recorded Harness Failure

| Evidence | Disposition |
|---|---|
| ev:T-0669:3f0ed20525474cc5b33780b6 | Resolved by ev:T-0669:92db1f03c50a4c369243c453. The first script assumed `--root` support for commands that are cwd-based and called `context pack` before creating a task. |

## Conclusion

The public `0.5.0-rc.1` package is installable from npm `next`, GitHub Release `v0.5.0-rc.1` is public, and bounded fresh-profile installed-package dogfood passed in Docker.
