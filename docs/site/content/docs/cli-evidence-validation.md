---
id: cli-evidence-validation
group: CLI Reference
label: Evidence & Validation Commands
short: validation run vs. evidence add-command, flag by flag.
icon: clipboard-check
eyebrow: Command reference
title: Executing proof and recording proof are different commands.
lead: HADARA keeps "run this and capture what happens" separate from "record a result I already have." Knowing which one you need keeps evidence honest about what was actually executed.
callout: HADARA flags must precede the -- separator; everything after -- belongs to the child command being validated.
order: 22
---

## Execute
### validation run
Use `validation run` when HADARA should execute the command and capture the actual exit status.

## Record
### evidence add-command
Use `evidence add-command` when the result already exists and you only need to append an evidence record.

## Guard
### Idempotency & locking
Evidence appends are task-scoped, idempotency-aware, and locally locked to avoid corrupting `evidence.jsonl`.

## Commands
```shell
hadara validation run --task T-0042 --check "unit tests" --json -- npm test
hadara validation run --task T-0042 --check "unit tests" --update-task -- npm test
hadara validation run --task T-0042 --check "unit tests" --direct-result passed --direct-summary "npm test passed directly" --update-task --json
hadara evidence add-command --task T-0042 --summary "manual smoke test passed" --result passed --category validation --idempotency-key "smoke:T-0042:manual" --json
hadara evidence list --task T-0042 --json
```

## Flag placement

HADARA flags must appear before the child-command separator `--`.

Correct:

```shell
hadara validation run --task T-0042 --check "unit tests" --json -- npm test
```

Incorrect:

```shell
hadara validation run --task T-0042 --check "unit tests" -- npm test --json
```

Everything after `--` belongs to the child command. In the incorrect example, `--json` is passed to `npm test`, not to HADARA.

## `validation run`

Use this for ordinary validation:

```shell
hadara validation run --task T-0042 --check "Focused tests" -- npm test
```

It executes the child command, captures exit code/signal, appends canonical evidence, and refreshes the generated evidence projection.

Add JSON output:

```shell
hadara validation run --task T-0042 --check "Focused tests" --json -- npm test
```

Update the matching `TASK.md` Validation row only when intended:

```shell
hadara validation run --task T-0042 --check "Focused tests" --update-task -- npm test
```

## Direct result through validation run

If the tool environment cannot launch the command but the command was run directly, record the direct result through `validation run`:

```shell
hadara validation run --task T-0042 --check "Focused tests" \
  --direct-result passed \
  --direct-summary "npm test passed directly after wrapper launch failed" \
  --update-task \
  --json
```

This preserves validation-check resolution tags and optional task-row synchronization.

## `evidence add-command`

Use this only to record an already-run result:

```shell
hadara evidence add-command \
  --task T-0042 \
  --summary "manual smoke test passed" \
  --result passed \
  --category validation \
  --idempotency-key "smoke:T-0042:manual" \
  --json
```

It does not execute shell commands. The caller is responsible for the truth of the supplied result.

## Side by side

| Capability | `validation run` | `evidence add-command` |
|---|---|---|
| Executes command | Yes | No |
| Captures real exit code | Yes | Caller supplies result |
| Can update TASK.md validation row | Yes, with `--update-task` | No ordinary row sync |
| Best for | Tests and checks HADARA can run | Manual/external results |
| Failure honesty | Failed command becomes failed evidence | Caller must not misreport |

## Outcomes

Valid result/outcome tokens include:

```text
passed
failed
blocked
unknown
recorded
not-applicable
```

Use exact spellings. Do not introduce custom words such as “success”, “ok”, or “n/a”.

## Idempotency keys

Use stable idempotency keys for retry-safe recording:

```text
command:T-0042:unit-tests
manual-smoke:T-0042:windows
release-preflight:T-0042:strict-gate
```

A timestamp is usually a bad idempotency key because it prevents duplicate detection.

## Concurrency

Do not run multiple evidence appends against the same task in parallel unless you deliberately accept lock contention. JSON responses expose append-lock information such as `contended`, `waitedMs`, and `timeoutMs` when relevant.

## Evidence discovery

Use:

```shell
hadara evidence list --task T-0042 --json
```

to find durable ids for `TASK.md` Acceptance/Validation rows and close-source documentation. Do not copy ids from memory when the evidence list can provide them.
