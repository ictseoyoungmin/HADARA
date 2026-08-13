---
id: evidence
group: Core model
label: Evidence & Gates
short: Make validation outcomes inspectable.
icon: file-check
eyebrow: Canonical evidence
title: A result should be replayable, not rhetorical.
lead: Evidence records what ran, what happened, and what artifact supports the claim. Close then evaluates whether that proof is sufficient.
callout: Canonical outcomes: passed, failed, blocked, unknown, recorded, and not-applicable.
order: 12
---

## Record
### Exact execution
Evidence records what ran, what happened, and which task it belongs to.

## Relate
### Acceptance linkage
Acceptance rows should point to durable evidence ids so close can explain why a criterion was considered satisfied.

## Gate
### Close decision
Close derives `closed-valid` from evidence and audit. A confident summary is not proof.

## Commands
```shell
hadara validation run --task T-0042 --check "unit tests" -- npm test
hadara evidence add-command --task T-0042 --summary "manual smoke passed" --result passed --category validation --json
hadara evidence list --task T-0042 --json
```

## Canonical evidence

Canonical evidence lives in:

```text
tasks/T-XXXX-<slug>/evidence.jsonl
```

Each line is an append-only JSON record. Records are not edited or deleted. If a failed check later passes, append a newer passed record; do not rewrite the old failure.

`EVIDENCE.md` is a generated projection for humans. Use it for review, but treat `evidence.jsonl` as the source of truth.

## Outcomes

Evidence outcome tokens are fixed:

| Outcome | Meaning |
|---|---|
| `passed` | The check or recorded result succeeded. |
| `failed` | The check ran and failed. |
| `blocked` | The check could not complete because of an external blocker. |
| `unknown` | The result could not be classified. |
| `recorded` | A non-pass/fail fact was recorded. |
| `not-applicable` | The check or criterion does not apply and the reason should be documented. |

Do not invent new outcome spellings. Use schema/help output when uncertain.

## Two evidence paths

| Path | Use when | Important property |
|---|---|---|
| `validation run` | HADARA should execute the command and capture the real exit status. | Runs the child command. |
| `evidence add-command` | You already have a result from outside HADARA. | Does not execute anything. |

## What close proof adds

`task close` appends close-proof evidence after readiness checks pass. Close proof records the acceptance ids, evidence refs used for readiness, close-source hashes, validation report hash, and related snapshot information. This makes `closed-valid` reconstructable later.

Close evidence is excluded from the pre-close validation loop because it is created after readiness is established. Requiring close evidence as a same-run precondition would create a fixed-point loop.

## Honesty rule

Evidence must reflect real execution or a real external observation. Invalid examples:

- marking tests `passed` without running them
- turning a blocked tool launch into a passed validation
- deleting a failed record after a fix
- putting secrets or private binary payloads into public evidence
- using `EVIDENCE.md` as if it were canonical

When the wrapper cannot launch a command but the command was run directly, record that direct result explicitly:

```shell
hadara validation run --task T-0042 --check "Focused tests" \
  --direct-result passed \
  --direct-summary "npm test passed directly after wrapper launch failed" \
  --update-task \
  --json
```

## Idempotency and locking

Evidence appends are task-scoped and serialized. Concurrent appends expose append-lock information in JSON output when applicable, so agents can detect contention instead of corrupting the log.

Use idempotency keys for retry-safe direct evidence:

```shell
hadara evidence add-command \
  --task T-0042 \
  --summary "manual smoke passed" \
  --result passed \
  --category validation \
  --idempotency-key "manual-smoke:T-0042" \
  --json
```
