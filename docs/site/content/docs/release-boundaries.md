---
id: release-boundaries
group: Reference
label: Release Boundaries
short: Separate source completion from deployment.
icon: shield-check
eyebrow: Safety boundary
title: Source completion is not production authority.
lead: HADARA can help produce a reviewable source state, but deployment, secrets, destructive actions and widened access remain explicit boundaries.
callout: A passed release gate means the declared evidence contract was satisfied—not that every external risk disappeared.
order: 30
---

## Source
### Complete the repository
HADARA can help make source state reviewable: code, docs, tests, release notes, evidence, and close gates.

## Authority
### Keep deployment policy explicit
Publish/deploy authority belongs to the project policy: manual, CI/CD, or hybrid. HADARA should not assume operator-only release.

## Audit
### Preserve the decision
Release reports should make it clear which evidence was evaluated and which boundary, if any, authorized publication.

## Commands
```shell
hadara release gate --mode strict --json
hadara release closeout --version <version> --task T-XXXX --json
hadara release publish --mode dry-run --json
hadara package recycle --package hadara@<version> --expected-version <version> --json
```

## The core boundary

A passed release gate means the declared repository evidence contract was satisfied. It does not mean:

- an npm package has been published
- a GitHub Release exists
- production has been deployed
- secrets were approved
- external systems were mutated
- every operational risk disappeared

Prepared source, published package, GitHub Release, and deployed service are different states.

## Manual, CI, or hybrid

HADARA should support all three release styles:

| Style | Example | HADARA role |
|---|---|---|
| Manual | A maintainer reviews evidence and runs publish commands. | Produce release gate, dry-run, and closeout evidence. |
| CI/CD | GitHub Actions publishes from a tag, branch protection, or workflow dispatch. | Emit machine-readable reports and fail closed on missing evidence. |
| Hybrid | Human approval triggers an automated workflow. | Record the evidence/approval boundary without hardcoding the platform. |

Do not document HADARA as “operator-only publish.” The correct rule is **policy-controlled publish/deploy**.

## Release gate

`hadara release gate --mode strict --json` is a read/evaluation surface. It should not publish packages, create GitHub releases, deploy services, write secrets, or mutate registries.

Use it to answer:

- Are required release docs present and current?
- Is there validation evidence for the release task?
- Are release notes and package/source metadata aligned?
- Are known blockers or accepted risks recorded?
- Is the release evidence sufficient for the declared policy?

## Release closeout

`release closeout` is a planning/reporting surface over release readiness, release notes, shared state docs, and selected release capsule docs. It should classify surfaces as current, stale, or missing and provide suggested fragments, not apply broad writes automatically.

## Package recycle

`hadara package recycle` checks a package from the consumer path. It can install into an isolated prefix, inspect command surfaces, run lightweight init/status/task-close smokes, and clean up. It is not the same as publishing.

Use it after an artifact exists:

```shell
hadara package recycle --package hadara@next --expected-version <version> --execute --json
```

## Secrets and external mutation

Do not put secret values into:

- task docs
- evidence summaries
- command logs
- context exports
- release reports
- public artifacts

Reports may state that a required token is present or absent, but should not print its value.

Blocked or high-risk operations include destructive filesystem commands, broad reset/clean operations, `curl | sh`-style installers, privilege escalation, disk formatting, and unreviewed writes outside the project root.

## Source completion vs publication

A task or release capsule can close with valid evidence while publication remains pending. That is not a contradiction. It means the repository is prepared according to its evidence contract; the project’s release policy still decides when and how to publish.

## Practical release sequence

```shell
hadara task status --json
hadara task create "Prepare release <version>" --json
# update release notes / metadata / validation docs
hadara validation run --task T-XXXX --check "Release gate" -- hadara release gate --mode strict --json
hadara task close --task T-XXXX --json
# policy-controlled publish/deploy occurs outside the close proof
hadara package recycle --package hadara@<version> --expected-version <version> --execute --json
```

The exact publish/deploy step may be manual, GitHub Actions, another CI/CD system, or a hybrid approval flow.
