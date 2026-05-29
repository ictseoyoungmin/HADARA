# Context

T-0143 is a manual RC publish dry-run capsule. It exists because the release candidate metadata and readiness evidence are now green, but actual mutation-capable publishing still requires explicit human action.

The helper script runs heavy local checks, refreshes evidence, builds a release artifact, runs HADARA dry-run gates, verifies the npm version does not already exist, and performs `npm publish --dry-run` against the exact tarball.

GitHub Release creation remains optional and draft-only. The release note should live in this capsule so the draft can be reproduced without embedding long inline text in the shell script.
