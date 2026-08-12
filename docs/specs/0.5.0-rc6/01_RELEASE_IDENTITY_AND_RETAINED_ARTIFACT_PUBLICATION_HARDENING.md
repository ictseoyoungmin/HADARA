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

The npm registry is an explicit publication destination. `--registry` must survive prepare,
dry-run, execute reinvocation, npm authentication/observation/publish calls, and the operator
publication report. A prepare-time custom registry must never silently fall back to the public npm
registry.

The GitHub destination is equally explicit. A clone created from a mounted workspace must not
retain the mounted path as its publication origin: preparation must rewrite and verify the clone
origin against the configured GitHub remote. The manual helper must use that same remote for tag
push and pass the configured `owner/name` to `gh release create --repo`; GitHub destination must
not be inferred from a local clone.

After npm publication and registry verification succeed, the helper must write and evidence-bind
an immutable npm-only publication report before GitHub authentication, tag, or release mutation.
If a later GitHub step fails, the npm mutation and its observed destination remain durable. A
successful GitHub draft must create a separate final report/evidence record and must not overwrite
the npm-only report or reuse its idempotency key.

Generated GitHub release notes are operator-local ignored state and are passed by their exact path
through prepare, dry-run, and execute guidance. They must not create a tracked dirty-tree exception
or be removed before the printed command consumes them. A retained re-invocation must preserve the
retained directory, report, npm tag, release-note, and draft flags.

### Evidence projection

`EVIDENCE.md` residual disposition and close readiness must use the same task-document parser and
semantic resolver. A failed record resolved by a later evidence record, legacy same-category
fallback, or a structured residual-risk row whose exact Link contains the evidence id and whose
state is `Mitigated`, `Resolved`, or `Accepted Risk` must not be projected as `Unresolved`. Blocked
records use the same exact-link rule with an explicit deferred/accepted/out-of-scope state. Free
text is informational only; negated prose such as “not resolved” or “not deferred” never creates a
resolution.

The package distribution inventory is also canonical: required files, allowed roots, staged
metadata files, and package `files` metadata derive from one exported inventory. Generated `dist/`
is distinguished from source/input hash files but must not be maintained as a second hardcoded
package allowlist.

### Timestamp contract

Command-owned human-readable task timestamps use canonical UTC minute precision with an explicit `Z`
suffix. Generated task metadata must not mix host-local time with container UTC time.

## Capsule budget

| Capsule | Purpose | External mutation |
|---|---|---|
| T-0784 | Establish release identity, lineage, retained publication, and initial evidence-binding hardening. | None |
| T-0785 | Complete reviewer-driven release-input, operator-helper, Release Note, and evidence-semantics hardening. | None |
| T-0786 | Complete publish-destination, evidence fail-closed, execute-reinvoke, and package-inventory hardening. | None |
| T-0787 | Regenerate the exact RC6 artifact and readiness from the post-T-0786 source. | None |
| T-0788 | Publish retained RC6 bytes to npm/GitHub under operator approval. | npm/GitHub only |
| T-0789 | Public terminal-lifecycle recycle and stable decision evidence. | Public consumer only; stable promotion separately approved |

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
