# T-0008 Policy Evaluator Shell Parser

## Goal

Create a safer policy evaluator foundation before ShellTool implementation by separating shell tokenization from command classification.

## Scope

- Add a minimal shell tokenizer that records words and shell operators.
- Add safe command allowlist handling for known build/test/read-only git commands.
- Block pipe-to-shell download execution, privilege escalation, destructive git cleanup/reset, and recursive destructive deletes.
- Preserve assisted-mode approval semantics.

## Out of Scope

- Full POSIX/PowerShell parser.
- ShellTool execution.
- Remote approval workflow.

## Status

Done
