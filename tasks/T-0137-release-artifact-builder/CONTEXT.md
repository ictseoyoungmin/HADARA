# Context

- `docs/DEVELOPMENT_SLICES.md` lists T-0137 after smoke evidence integration and before release gate evidence freeze.
- `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` says T-0137 should build a tarball, checksum, manifest, verify package contents against a whitelist, and emit a reduced release artifact report without publishing or creating a GitHub Release.
- `docs/RELEASE_READINESS.md` keeps release gate read-only. T-0137 must not make `release gate` execute packaging.
- Package metadata remains bootstrap-stage with `private: true`; T-0137 builds local artifacts for verification only and does not make the package publishable.
- T-0136 introduced `hadara.smokeEvidenceSummary.v1` inside reduced smoke evidence artifacts. Before T-0138 reads those evidence artifacts, that summary shape should be promoted to a registered schema fixture.
- T-0136 excludes raw logs from public evidence. Future debugging raw-log retention must write only to ignored private/local storage with manifests or audit metadata.
- Public release artifact metadata should avoid "bootstrap skeleton" wording; staged package metadata uses `HADARA: portable agentic development workbench`.
- Explicit retained artifact output should use ignored local directories such as `dist-release/`; retained tarballs, checksums, and manifests should not be committed.
- Generated release artifact manifests currently use `hadara.releaseArtifact.manifest.v1`; register that schema before release gates read manifest files directly.
