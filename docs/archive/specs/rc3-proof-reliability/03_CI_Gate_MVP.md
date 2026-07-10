# CI Gate MVP

## Basis

Dogfooding showed that HADARA's value is auditability and proof. A CI gate makes that value enforceable in pull requests and local automation.

## Goals

- Provide a small read-only gate command for local CI and GitHub Actions.
- Aggregate protocol, evidence, proof, and existing release readiness checks.
- Support `advisory` and `strict` modes only.
- Avoid task mutation, evidence append, publish, deploy, dashboard, or TUI dependencies.

## Command

```bash
hadara ci gate --mode advisory --json
hadara ci gate --mode strict --json
```

## MVP Behavior

| Check | Source |
|---|---|
| Protocol | `protocol doctor --json` equivalent read model where available. |
| Evidence | Evidence lint for discovered task capsules. |
| Proof | `proof status` for Done tasks and the active/recommended task when available. |
| Release | Existing release gate/dry-run surfaces only when release work is detected or requested later. |

Initial implementation can aggregate task-local evidence/proof directly and document protocol wrapper limitations if the existing protocol doctor surface is not yet factored for reuse.

## Modes

| Mode | Exit/ok Behavior |
|---|---|
| advisory | Warnings do not make `ok:false`; blockers are reported as advisory findings. |
| strict | Blocking protocol/evidence/proof findings make `ok:false`. |

`policy-strict` is deferred.

## JSON Shape

```json
{
  "schemaVersion": "hadara.ci.gate.v1",
  "command": "ci.gate",
  "ok": true,
  "mode": "advisory",
  "checks": [],
  "blockers": [],
  "warnings": []
}
```
