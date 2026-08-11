# T-0765 RC3 Reconciliation Report

## Public release state

The tracked release state now matches the observed public surfaces:

- npm `hadara@next` is `0.5.0-rc.3`.
- npm `latest` is `0.4.6`.
- GitHub `v0.5.0-rc.3` is public, not draft, and `isPrerelease=true`.
- GitHub currently has zero custom assets. This is accepted under the independent-target contract; custom asset parity is not a default acceptance gate.
- T-0763 already proves public consumer installation and deep lifecycle execution through `closed-valid`, same-close zero-write retry, and fresh idle status with no recommendation.

## Artifact provenance

The original T-0763 release-workspace files were not present in the repository or bounded local searches. A read-only `npm pack hadara@0.5.0-rc.3` recovery produced a `427965` byte tarball with SHA-256:

`843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53`

This matches T-0763's expected tarball hash and byte length. The expected checksum file was reconstructed from the recovered tarball hash and filename; its `88` byte SHA-256 is:

`fe89b68ca6e773f36a21b3b166a06012a51dbbad634e1513a75eeb9e2aecd4a7`

The expected `23426` byte manifest was reconstructed from the registry package file list and the release-artifact manifest metadata contract; its SHA-256 is:

`eb52a65efc728be7ef1434670b7ab547b55f5c08f8252aae6cf037d07d35c903`

All three hashes match T-0763's expected values. This is byte-identical reconstruction from the published npm package, not evidence that the original operator files were retained. No reconstructed file is labeled or uploaded as an original asset by this capsule.

## Fresh standard-init finding

Both the current built CLI and the public RC3 package reproduce the same standard-preset behavior:

- `init doctor --json`: pass.
- `docs doctor --scope all --json`: pass with `currentnessVerdict=clean`.
- `protocol doctor --json`: warning-only, with eight warnings: seven missing workflow scaffold sections/table and one `PROFILE_REQUIRED_READING_DRIFT` warning for `AGENTS.md`.

The finding is not a false positive. Init v1 writes the compact scaffold from `src/init/model.ts` (`createWorkflow` and `createAgentsBootstrap`), while protocol consistency checks the richer workflow-section contract in `src/services/protocol-consistency.ts` and profile-required paths from `src/init/profile.ts`. The generated project therefore warns about its own generated files. The runtime/scaffold contract should be reconciled in a separate `0.5.0-rc.4` remediation capsule before stable promotion.

## Release decision

RC3 remains a valid public prerelease and its npm consumer lifecycle proof is complete. Stable promotion is not recommended yet because the fresh standard-init warning is a product-level first-run defect. The next release action is an rc.4 implementation/remediation capsule; stable promotion can be reconsidered after a warning-free fresh standard project (or a reviewed, explicit warning disposition).

## Graphify portability

The reusable guide now resolves Graphify with `command -v graphify` and uses `"$HOME/.local/bin/graphify"` only as a portable user-local fallback. The developer-machine path `/home/ymin/.local/bin/graphify` is removed.
