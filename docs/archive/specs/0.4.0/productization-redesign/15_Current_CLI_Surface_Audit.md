# 15 Current CLI Surface Audit

## Purpose

Keep redesign docs honest about which commands currently exist and which are proposed by the 0.4 redesign.

This audit is based on repository documentation inspected during redesign. Implementers must verify against the current command registry before coding.

## Current Baseline Surfaces

### Start / Discovery

```bash
hadara help
hadara help lifecycle
hadara help command <id>
hadara commands --json
hadara commands --family <family> --json
```

### Init

```bash
hadara init
hadara init --profile basic
hadara init --profile standard
hadara init --profile governed
hadara init doctor --json
hadara init upgrade --profile governed --json
hadara init register-doc --path <path> --when "..." --purpose "..." --json
hadara init enable-integration --integration mcp --json
```

### Lifecycle

```bash
hadara task next --json
hadara session start --task T-XXXX --json
hadara task create "task title" --json
hadara task status --task T-XXXX --json
hadara evidence add-command --task T-XXXX --summary "..." --result passed --category validation --json
hadara evidence list --task T-XXXX --json
hadara evidence summary --task T-XXXX --json
hadara task lifecycle --task T-XXXX --json
hadara task finalize --task T-XXXX --json
hadara task finalize --task T-XXXX --execute --plan-hash sha256:... --json
hadara handoff suggest --task T-XXXX --json
```

### Diagnostics / Low-Level Lifecycle

```bash
hadara task complete --task T-XXXX --json
hadara task close-repair-plan --task T-XXXX --json
hadara task finish --task T-XXXX --json
hadara task ready --task T-XXXX --level done --json
hadara task close --task T-XXXX --json
hadara task audit-close --task T-XXXX --json
hadara evidence lint --task T-XXXX --json
hadara proof status --task T-XXXX --json
hadara proof explain --task T-XXXX --json
hadara protocol doctor --json
hadara ci gate --mode advisory --json
hadara ci gate --mode strict --json
```

### Docs Governance

```bash
hadara docs list --json
hadara docs doctor --json
hadara docs explain --path <path> --json
hadara docs required-reading --json
hadara docs mark --path <path> --status superseded --by <path> --reason "..." --json
hadara docs archive --status superseded --json
hadara docs managed list --json
hadara docs managed explain --path <path> --json
hadara docs patch --path <path> --section <section-id> --content-file <path> --json
```

### Context Routing

```bash
hadara context graph --json
hadara context graph --task T-XXXX --json
hadara context graph --include-code --json
hadara context pack --task T-XXXX --json
hadara context pack --task T-XXXX --include-code --json
hadara context slice --path <path> --from <line> --to <line> --json
hadara context slice --task T-XXXX --candidate <candidate-id> --json
hadara context cache status --json
hadara context cache warm --json
hadara context cache warm --execute --json
hadara session start --json
hadara session start --task T-XXXX --json
hadara session start --task T-XXXX --live --json
```

### Release / Package

```bash
hadara package smoke --dry-run --json
hadara package smoke --execute --json
hadara package recycle --json
hadara package recycle --execute --json
hadara smoke clean-checkout --execute --json
hadara release artifact --execute --json
hadara release gate --mode strict --json
hadara release dry-run --json
hadara release publish --mode dry-run --json
hadara release closeout --version <version> --task <task-id> --json
```

## Proposed 0.4 Surfaces

These must not be described as current until implemented.

```bash
hadara docs read-map --task T-XXXX --json
hadara docs inbox --json
hadara docs register --path <path> --json
hadara docs complete-spec --path <path> --implemented-by T-XXXX --json
hadara docs mark-drift --path <path> --risk high --reason "..." --json
hadara evidence project --task T-XXXX --json
hadara evidence project --task T-XXXX --execute --json
```

## Removed / Not Proposed

```bash
hadara task create "task title" --layout compact --json
hadara task create "task title" --layout expanded --json
hadara task create "task title" --capsule-layout compact-v1 --json
hadara task layout --task T-XXXX --json
hadara task migrate-layout --task T-XXXX --to compact-v1 --json
hadara init upgrade --target 0.4.0 --json
```

## Rule for Future Spec Edits

Any CLI example in this redesign must be labeled one of:

```text
Current baseline
Proposed 0.4
Not proposed / removed
```
