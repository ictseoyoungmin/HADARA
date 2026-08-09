# HADARA 0.5.0-rc.3

## Release Candidate

HADARA `0.5.0-rc.3` is the RC3 source line after Init v1 authority fail-close hardening and reviewer-clarified read-routing and release-readiness boundaries.

## Included

- Init v1 `.hadara/project.json` + `.hadara/documents.json` authority validation with partial/invalid-state fail-close behavior.
- Canonical Init v1 project/document validators shared by doctor, docs routing, docs mutation, and init upgrade paths.
- Mixed-format read-routing and delegated work/evidence/handoff acceptance.
- Exact release-artifact to package-smoke provenance binding.

## Verification

T-0763 records the current committed RC3 artifact, exact tarball package smoke, clean-checkout smoke, full repository validation, strict release gate, release dry-run, publish dry-run, and exact-tarball npm publish dry-run. npm publication, GitHub Release mutation, and installed public-consumer recycle remain operator-controlled steps.
