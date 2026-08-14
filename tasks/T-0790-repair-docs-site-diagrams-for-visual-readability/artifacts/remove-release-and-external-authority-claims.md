# Remove Release and External-Authority Claims from Public Docs

## Design correction

Repository-local release tools and scripts support development of HADARA itself. They are not a public HADARA authority model and do not imply that HADARA decides whether another project may publish, deploy, automate a release, or mutate an external system.

General users may choose their own release automation and permissions. Public documentation therefore must not present external-action approval or release gates as a HADARA product surface.

## Removed public surface

- Deleted the `Approval Boundaries` page and its navigation entry.
- Removed release-gate ownership from What is HADARA.
- Removed publishing, package-release, deployment, registry, remote-mutation, payment, credential, and external-authority examples.
- Removed release-platform and explicit-boundary language from Home.
- Removed external-approval language from Workflow and Limits & Recovery.
- Removed approval-loop and approval-request labels from the operating-model and lifecycle diagrams.

## Preserved scope

HADARA still describes guarded writes for its own project-local Task Capsule, evidence, routing, and close state. Task-local waiting, blocker, and human-decision states remain because they are generic continuation semantics, not claims over deployment or publishing authority.

## Regression boundary

The public content contract now rejects:

- an Approval Boundaries page;
- release-gate or silent-publishing claims;
- permission-to-publish or external-authority language;
- deployment/registry/payment example lists;
- release-platform and external-action control wording.

## Validation

- `npm test` in `docs/site`: passed
- `npm run build` in `docs/site`: passed
- Headless Edge desktop review confirmed that the page is absent from navigation and Home contains no external-action approval copy.

T-0790 remains open for human visual review.
