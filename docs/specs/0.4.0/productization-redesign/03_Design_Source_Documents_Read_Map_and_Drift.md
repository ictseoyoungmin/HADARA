# 03 Design Source Documents, Read Map, and Drift

## Goal

Manage `docs/specs/**` and other design documents as governed source documents.

HADARA must not treat every Markdown file under `docs/specs/**` as default required reading.

## Design Source Document

A design source document may be:

```text
a rough idea
a proposed design
an approved normative spec
an implementation source
a release plan
a migration guide
a design note
an agent-edited spec
an implemented reference
a drift-risk document
a superseded historical document
```

File names such as `SKETCH.md` are not required. The registry decides document role and read behavior.

## Document Metadata Axes

| Axis | Values |
|---|---|
| `documentKind` | `spec`, `product-brief`, `design-note`, `decision-record`, `runbook`, `workflow-reference`, `implementation-plan`, `migration-guide`, `release-plan` |
| `authority` | `exploratory`, `proposed`, `approved`, `normative`, `implementation-source`, `reference-only`, `historical` |
| `status` | `draft`, `review`, `approved`, `implementing`, `implemented`, `superseded`, `drift-risk`, `archived` |
| `readTier` | `bootstrap`, `current-state`, `workflow-reference`, `active-task`, `active-spec`, `conditional-reference`, `implemented-reference`, `drift-review`, `historical`, `excluded` |
| `editPolicy` | `human-only`, `agent-assisted`, `agent-editable-with-request`, `agent-editable-with-review`, `cli-owned`, `generated-projection` |

## Registry Example

```json
{
  "id": "spec.0.4.task-capsule",
  "path": "docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md",
  "title": "Task Capsule Schema",
  "documentKind": "spec",
  "authority": "normative",
  "status": "implementing",
  "readTier": "active-spec",
  "editPolicy": "agent-editable-with-review",
  "readWhen": [
    "Changing task create scaffold",
    "Changing Task Capsule parsing",
    "Changing task finalize close-source inputs"
  ],
  "doNotReadWhen": [
    "Unrelated ordinary task work",
    "Release publish work unless task schema changes release artifacts"
  ],
  "activeForTasks": ["T-04XX"],
  "implementedByTasks": [],
  "supersedes": [],
  "supersededBy": null,
  "drift": {
    "risk": "low",
    "reviewRequiredBeforeUse": false,
    "reason": null
  }
}
```

## Registry Storage and Projection

The canonical registry file is:

```text
.hadara/docs-registry.json
```

`hadara docs register --path <path> --json` writes or plans changes to that registry. It must not append per-document rows to `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, `docs/HADARA_WORKFLOW.md`, or a default SOP file.

If a human-readable registry view is needed, it should be a generated projection such as:

```text
docs/DOC_REGISTRY.md
```

That projection is optional and derived. `.hadara/docs-registry.json` remains authoritative.

## Read Map

`hadara docs read-map --task T-XXXX --json` is a proposed 0.4 surface.

It returns:

```json
{
  "schemaVersion": "hadara.docs.readMap.v1",
  "taskId": "T-0001",
  "readFirst": [],
  "readIfNeeded": [],
  "doNotReadByDefault": [],
  "driftWarnings": []
}
```

### Read First

Use for:

```text
active task docs
active implementation spec for the task
current project state
```

### Read If Needed

Use for:

```text
workflow reference
conditional architecture/security/release docs
implemented reference specs when changing that feature
```

### Do Not Read By Default

Use for:

```text
historical
superseded
archived
excluded
unregistered specs
implemented specs unrelated to the task
```

### Drift Warnings

Use when a document may still be useful but must not be treated as current authority without review.

## Design Source Link in `TASK.md`

A task derived from design source documents records them by path and hash.

```md
## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| `docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md` | implementation-source | normative | implementing | `sha256:...` | Primary source for this task. |
```

If a source document changes after task interpretation, diagnostics should report:

```text
TASK_SOURCE_DOCUMENT_CHANGED
```

## Agent Edits to Design Source Documents

Agents may update design source documents when:

```text
the operator asks for it;
the registry editPolicy allows it;
the change is summarized with stable areas/modules;
the docs registry is updated if status, authority, readTier, editPolicy, or drift changes.
```

## Proposed Docs Commands

```bash
hadara docs read-map --task T-XXXX --json
hadara docs inbox --json
hadara docs register --path <path> --json
hadara docs complete-spec --path <path> --implemented-by T-XXXX --json
hadara docs mark-drift --path <path> --risk high --reason "..." --json
```

These are proposed 0.4 surfaces unless already implemented by the repository at the time of implementation.
