# Plan

1. Read release readiness docs, development slice ordering, and T-0136 handoff notes.
2. Define `hadara.releaseArtifact.v1` and the explicit `release artifact --execute` CLI surface.
3. Implement the release artifact service with disposable staging, npm tarball creation, checksum, manifest, and whitelist verification.
4. Add focused tests for execution guard, explicit output, whitelist failure, schema runtime, schema fixtures, and tools discovery.
5. Run focused Docker validation, full Docker check, built CLI artifact smoke, strict release gate, and done-level harness validation.
