# Context

Relevant documents and constraints:

- `docs/DEVELOPMENT_SLICES.md` row 86 defines T-0131 as the major-feature smoke runner slice.
- `docs/RELEASE_READINESS.md` and `docs/TEST_STRATEGY.md` define the first `core` profile and the deferred `release-readiness` profile.
- T-0130 install-matrix planning expects future package/install smoke flows to reuse this runner rather than duplicate major-feature checks.
- The current capsule must not create package artifacts, run install smoke, mutate evidence, publish, or call external providers.
- Host Node/npm is unreliable in this environment, so validation uses the reusable `hadara-dev` Docker temp-copy workflow.
