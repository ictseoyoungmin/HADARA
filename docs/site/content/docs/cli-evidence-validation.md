---
id: cli-evidence-validation
group: Agent protocol
label: Evidence & Validation
short: Agent-facing check execution and append-only evidence protocol.
eyebrow: Agent protocol reference
title: The agent runs the check and preserves the proof.
lead: Validation execution and evidence recording are related but distinct protocol surfaces. They exist so an agent can leave durable, reduced proof without asking the human to operate an evidence ledger.
callout: Ordinary users should inspect the evidence projection rather than type these commands. This page is for agents, integrations, debugging, and advanced protocol review.
audience: agent-protocol
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

## Direct result mode

An agent or integration may supply a direct validation observation when it genuinely owns that observation. Unverified assumptions must not be converted into `passed` evidence.

```shell
hadara validation run \
  --task T-0042 \
  --check "External validation" \
  --direct-result passed \
  --direct-summary "External check passed" \
  --update-task \
  --json
```

## Categories and outcomes

Evidence v2 outcomes include `passed`, `failed`, `blocked`, `unknown`, `recorded`, and `not-applicable`. Legacy `--result` remains supported; incompatible legacy/result and v2 outcome combinations fail before append.

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
