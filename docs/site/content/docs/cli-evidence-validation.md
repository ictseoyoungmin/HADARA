---
id: cli-evidence-validation
group: Agent protocol
label: Evidence & Validation
short: Agent-facing check execution and append-only evidence protocol.
eyebrow: Agent protocol reference
title: The agent runs the check and preserves the proof.
lead: Validation execution and evidence recording are related but distinct protocol surfaces. They exist so an agent can leave durable, reduced proof without asking the human to operate an evidence ledger.
callout: Ordinary users should inspect the evidence projection rather than type these commands. This page is a command reference for coding agents and integrations.
audience: agent-protocol
commandAudience: agent-protocol
order: 22
---

## 01 · Execute
### validation run
Wrap a real command when HADARA should execute the check and capture its reduced result.

## 02 · Append
### evidence add-command
Use it for checks that already ran or for explicitly reduced command evidence with category/outcome metadata.

## 03 · Inspect
### list and lint
Discover persisted evidence IDs before creating durable structured references; lint when evidence shape or integrity is in doubt.

## Agent commands

```shell
hadara validation run --task T-0042 --check "Focused tests" -- npm test
hadara evidence add-command --task T-0042 --summary "Focused tests passed" --result passed --category validation --json
hadara evidence list --task T-0042 --json
hadara evidence lint --task T-0042 --json
```

## Choosing the evidence path

| Situation | Agent command | Executes the check? | Human-visible result |
|---|---|---:|---|
| HADARA should run a real command | `validation run` | Yes | Reduced result and durable evidence projection |
| A trustworthy external/direct observation already exists | `evidence add-command` | No | Explicitly attributed evidence record |
| A durable evidence ID is needed | `evidence list` | No | Persisted `ev:` identity for acceptance/resolution |
| Bound artifacts or evidence shape may be stale | `evidence lint` | No | Missing/hash/byte-length or semantic integrity issue |

## Direct result mode

An agent or integration may supply a direct validation observation when it genuinely owns that observation. Unverified assumptions must not be converted into `passed` evidence.

```shell
hadara validation run \
  --task T-0042 \
  --check "External validation" \
  --direct-result passed \
  --direct-summary "External check passed" \
  --update-task \
  --json \
  -- npm test
```

The command after `--` is not executed again in direct-result mode. It preserves the original command argv in the validation check identity, so a passed direct result can resolve the matching blocked attempt; keep the check label and exact argv unchanged.

## Categories and outcomes

Evidence outcomes include `passed`, `failed`, `blocked`, `unknown`, `recorded`, and `not-applicable`. The supplied result and outcome must agree; invalid combinations fail before append.

## Artifact binding

When an evidence record attaches a public reduced artifact, HADARA stores its task-local path, SHA-256, and byte length. Lint rechecks those bytes. The agent must treat a missing or changed bound artifact as an integrity failure rather than relying on a summary that merely says the check passed.

`evidence add-command` does not run the claimed check; it appends the supplied observation to the evidence ledger. The agent must therefore review the result and summary before recording it.

## Resolution references

The agent should list evidence, copy the durable persisted `ev:` identity, and use that identity in explicit `resolves`/`supersedes` relationships. Free-text similarity is not resolution integrity.

```shell
hadara evidence list --task T-0042
hadara evidence add-command \
  --task T-0042 \
  --summary "Fix verified" \
  --result passed \
  --category validation \
  --resolves ev:T-0042:aaaaaaaaaaaaaaaaaaaaaaaa \
  --json
```

Humans normally encounter the result through status, Task Capsule review, and `EVIDENCE.md` rather than by constructing these records manually.
