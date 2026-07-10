# 11 Legacy Project Boundary

## Goal

Replace migration and dual-layout compatibility with a clear unsupported-project boundary.

HADARA 0.4 is for new 0.4 projects. It does not mutate 0.3.x projects.

## Detection

A project should be considered legacy when it has evidence of old HADARA protocol/scaffold state, such as:

```text
missing `.hadara/scaffold.json`
scaffold protocol not `0.4`
expanded task capsule frames incompatible with `hadara.taskCapsule.v1`
old docs registry schema incompatible with `hadara.docsRegistry.v2`
old generated docs requiring expanded capsule files as default reading
```

Detection must be conservative. If uncertain, fail closed for mutation commands and report how to inspect manually.

## Mutation Boundary

The following must fail closed on legacy projects:

```text
task create
task finalize --execute
evidence append
docs registry mutation
managed slot patch
release artifact/publish mutation
init upgrade mutation
```

`hadara init upgrade --profile ...` remains a same-protocol profile change command for already-supported 0.4 projects. It is not a 0.3-to-0.4 migration path. When `.hadara/scaffold.json` is missing or declares a non-0.4 protocol, `init upgrade` must return a legacy/unsupported diagnostic instead of writing a 0.4 scaffold over the old project.

## Read-Only Diagnostics

`hadara doctor --json` may run and return an unsupported-project diagnostic.

Example:

```json
{
  "ok": false,
  "code": "HADARA_LEGACY_PROJECT_UNSUPPORTED",
  "detectedProtocol": "0.3",
  "supportedProtocol": "0.4",
  "mutationAllowed": false,
  "nextActions": [
    {
      "label": "Use previous HADARA line for this project",
      "command": "npx hadara@0.3.3 doctor --json"
    },
    {
      "label": "Initialize a new HADARA 0.4 project",
      "command": "hadara init --json"
    }
  ]
}
```

## No Migration Command

The 0.4 redesign does not include:

```text
task migrate-layout
project migrate-layout
automatic expanded task conversion
dual parser behavior
silent old-project mutation
```

## Optional Export Later

A future 0.4.x line may define a read-only legacy export report, but it is not part of 0.4.0.

## Diagnostics

```text
HADARA_LEGACY_PROJECT_UNSUPPORTED
HADARA_LEGACY_PROJECT_MUTATION_BLOCKED
HADARA_PROTOCOL_MISSING
HADARA_PROTOCOL_UNSUPPORTED
HADARA_LEGACY_DOCS_REGISTRY
HADARA_LEGACY_TASK_CAPSULE
```
