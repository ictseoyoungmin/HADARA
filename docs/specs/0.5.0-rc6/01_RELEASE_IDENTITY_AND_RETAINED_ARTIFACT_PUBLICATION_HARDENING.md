# RC6 Release Identity and Retained Artifact Publication Hardening

## Purpose

Close the remaining release-trust gap before RC6 publication. Release compatibility is tied to
the deterministic `releaseInputHash` and the exact retained artifact, not to the mutable HEAD of
the operator capsule.

## Normative contract

### Release identity

`releaseInputHash` is the compatibility identity of a package candidate. A single canonical
inventory in `release-input.ts` is used by both release-artifact construction and current-state
compatibility checks. It covers the tracked implementation/build inputs under `src/`, `tools/`, and
`scripts/`, the package/toolchain configuration, and package-distributed metadata such as
`package.json`, `README.md`, and `LICENSE`. Relevant untracked or ignored inputs in those roots make
the identity unavailable and fail artifact construction closed; they must not be silently omitted.
Task capsules, evidence, HANDOFF, and other evidence-only commits do not change this identity.

The hash is the source/build-input identity, while the tarball, checksum, and manifest digests bind
the produced package bytes. A commit SHA alone is never a substitute for either identity.

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

New publication reports require the complete tuple `artifactSourceCommit`, `releaseInputHash`, and
`operatorCommit`. Legacy publication reports with only `sourceCommit` remain readable for
historical/public facts, but cannot establish stable compatibility. A partially populated new
lineage is invalid for readiness; it must not be treated as a legacy report or as compatible.

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

Generated GitHub release notes are operator-local ignored state and are passed by their exact path
through prepare, dry-run, and execute guidance. They must not create a tracked dirty-tree exception
or be removed before the printed command consumes them. A retained re-invocation must preserve the
retained directory, report, npm tag, release-note, and draft flags.

### Evidence projection

`EVIDENCE.md` residual disposition and close readiness must use the same task-document parser and
semantic resolver. A failed record resolved by a later evidence record, legacy same-category
fallback, or a structured residual-risk row with state `Mitigated`, `Resolved`, or `Accepted Risk`
must not be projected as `Unresolved`. Free-text negation such as “not resolved” must not create a
false resolution.

### Timestamp contract

Command-owned human-readable task timestamps use canonical UTC minute precision with an explicit `Z`
suffix. Generated task metadata must not mix host-local time with container UTC time.

## Capsule budget

| Capsule | Purpose | External mutation |
|---|---|---|
| T-0784 | Establish release identity, lineage, retained publication, and initial evidence-binding hardening. | None |
| T-0785 | Complete reviewer-driven release-input, operator-helper, Release Note, and evidence-semantics hardening. | None |
| T-0786 | Regenerate the exact RC6 artifact and readiness from the post-T-0785 source. | None |
| T-0787 | Publish retained RC6 bytes to npm/GitHub under operator approval. | npm/GitHub only |
| T-0788 | Public terminal-lifecycle recycle and stable decision evidence. | Public consumer only; stable promotion separately approved |

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
