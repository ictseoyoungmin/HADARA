# RC6 Release Identity and Retained Artifact Publication Hardening

## Purpose

Close the remaining release-trust gap before RC6 publication. Release compatibility is tied to
the deterministic `releaseInputHash` and the exact retained artifact, not to the mutable HEAD of
the operator capsule.

## Normative contract

### Release identity

`releaseInputHash` is the compatibility identity of a package candidate. It is computed from the
tracked release inputs under `src/`, `tools/`, `scripts/`, and the release package/toolchain files
defined by `release-input.ts`. Task capsules, evidence, HANDOFF, and other evidence-only commits do
not change this identity.

Publication lineage must distinguish:

```json
{
  "artifactSourceCommit": "7ccd1634...",
  "releaseInputHash": "sha256:...",
  "operatorCommit": "95e6645..."
}
```

`artifactSourceCommit` identifies the clean source used to create the retained bytes. `operatorCommit`
identifies the checkout that performed the external mutation. Neither commit is the stable
compatibility gate; the current computed `releaseInputHash` must equal the published report's hash.

Legacy publication reports without `releaseInputHash` remain readable for historical/public facts,
but cannot establish stable compatibility.

### Retained artifact publication

The manual publish helper has two explicit modes:

- preparation mode: generate and validate a new artifact;
- retained-input mode: consume a caller-provided directory containing the exact `.tgz`, `.sha256`,
  `.manifest.json`, and release-artifact journal/report.

Retained-input mode must not call `release artifact --execute`, `npm pack`, or regenerate the
tarball. It validates checksum, manifest, package metadata, release input hash, and exact asset
digests before using the same bytes for npm and GitHub.

The preparation helper must carry the retained artifact locator into the printed operator command.
The logical locator is public; the actual path remains local/ignored operator state.

### Evidence projection

`EVIDENCE.md` residual disposition and close readiness must use the same semantic resolver. A failed
record resolved by a later evidence record, same-category fallback, or documented residual-risk
mitigation must not be projected as `Unresolved`.

### Timestamp contract

Command-owned human-readable task timestamps use canonical UTC minute precision with an explicit `Z`
suffix. Generated task metadata must not mix host-local time with container UTC time.

## Capsule budget

| Capsule | Purpose | External mutation |
|---|---|---|
| T-0784 | Implement this hardening and regression coverage. | None |
| T-0785 | Regenerate exact RC6 artifact/readiness after source changes. | None |
| T-0786 | Publish retained RC6 bytes to npm/GitHub under operator approval. | npm/GitHub only |
| T-0787 | Public terminal-lifecycle recycle and stable decision evidence. | Public consumer only; stable promotion separately approved |

If a P1 fails, the affected later capsule is invalidated and the same version is regenerated while
it remains unpublished. No RC number is incremented merely because preparation source changed.

## Acceptance

- current-state stable compatibility survives evidence-only/operator commits when the hash matches;
- hash mismatch and missing publication hash fail closed with a precise lineage issue;
- retained-input publication cannot silently regenerate bytes;
- npm and GitHub asset paths resolve to the same retained files;
- failed evidence projection agrees with close semantic classification;
- generated task/HANDOFF timestamps are unambiguous across host and Docker execution;
- all changes are recorded in one implementation capsule before RC6 regeneration.
