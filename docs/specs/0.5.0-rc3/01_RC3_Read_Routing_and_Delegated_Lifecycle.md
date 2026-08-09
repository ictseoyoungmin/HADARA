# RC3 Read Routing and Delegated Work, Evidence, and Handoff Acceptance

## Status

Active RC3 acceptance contract. Owner: T-0758.

## Objective

Prove that a fresh Init v1 project can route a selected task's reading without requiring a large global document scan, including registered Markdown, TXT, DOCX, and PDF paths. Then prove that a delegated worker can use the routed capsule and workflow documents to perform the delegated work, evidence, and handoff portion of the task flow for the next reviewer.

This is not an end-to-end task lifecycle acceptance: the delegated worker must stop before `task close`, operator publication, registry recycle, and any external release mutation.

## Routing Scenario

The acceptance fixture contains:

| Group | Count | Required routing |
|---|---:|---|
| Current release documents | 3 | `readFirst`, task-scoped to the active capsule |
| Policy/design documents | 2 | `readIfNeeded`, conditional reference |
| Future/deferred documents | 3 | `doNotReadByDefault`, excluded or never-default |

At least one document in each group uses a non-Markdown extension. Registration stores the path and routing metadata; content extraction and locator semantics remain out of scope.

## Delegated Work, Evidence, and Handoff

The worker receives the command to follow the HADARA workflow. It must:

1. discover the selected capsule through `task status` and `docs read-map --task`;
2. read only the routed capsule and required references;
3. record a validation/evidence result through the CLI;
4. update human-owned capsule prose and handoff;
5. leave an inspectable continuation handoff for the reviewer, without invoking `task close`, publishing, or recycling a package.

The reviewer verifies that the worker did not treat `READ_MAP.md` as a second authority, hand-edit command-owned identity, or select an excluded/future document as default input.

## Acceptance

- Fresh Init v1 reads `.hadara/documents.json` and generated `READ_MAP.md`.
- The routing report has exactly the expected first/conditional/default-excluded grouping for the fixture.
- Re-running registration and projection generation is deterministic and does not create `.hadara/docs-registry.json`.
- A delegated worker completes task-local status, read-map, validation/evidence, and handoff steps in a fresh fixture.
- The delegated run explicitly does not invoke `task close` and stops before operator publish, registry recycle, or any external release mutation.
