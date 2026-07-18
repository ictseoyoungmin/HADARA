# Lifecycle Quickstart

HADARA work moves through one focused Task Capsule at a time.

## 1. Select Or Create Work

```bash
hadara task status --json
hadara task create "focused task title" --json
hadara task status --task T-0001 --summary-json
```

`task status` is read-only. `ok:true` means the report was generated, not that the task is complete.

## 2. Keep The Capsule Current

Keep `TASK.md` focused on what is being done, how it will be validated, and what evidence proves it.

The default 0.4 capsule files are:

```text
TASK.md
HANDOFF.md
EVIDENCE.md
evidence.jsonl
```

`evidence.jsonl` is canonical. `EVIDENCE.md` is a human-readable projection.

## 3. Validate With Evidence

Prefer `validation run` when HADARA should execute the check and record evidence:

```bash
hadara validation run --task T-0001 --check "Unit tests" -- npm test
```

Use `evidence add-command` for an already-run check:

```bash
hadara evidence add-command --task T-0001 --summary "Unit tests passed" --result passed --category validation --json
```

Use durable `ev:` ids for long-lived references:

```bash
hadara evidence list --task T-0001
```

## 4. Close

For ordinary clean work, run the proof-last close transaction:

```bash
hadara task close --task T-0001 --json
```

If a separate reviewer or automation boundary requires a reviewed plan hash, dry-run first and execute the reported hash:

```bash
hadara task close --task T-0001 --dry-run --json
hadara task close --task T-0001 --execute --plan-hash sha256:... --json
```

Task close runs the underlying finish, ready, close, and audit boundaries in order. It succeeds only when close audit reaches `closed-valid`.

## Diagnostics

These are useful when the default loop needs explanation:

```bash
hadara task status --task T-0001 --json
hadara evidence list --task T-0001 --json
hadara harness validate --task T-0001 --level done --json
hadara task status --task T-0001 --detail full --json
```

Standalone low-level lifecycle commands are removed. Use `task status --detail full` for diagnostics and `task close` for finish, readiness, close, audit, and recovery.
