# T-0017 Policy Execution Preflight

## Goal

Add a shell execution preflight contract before ShellTool implementation so future shell execution has a deterministic policy gate.

## Scope

- Add a versioned shell execution preflight report.
- Map policy decisions to execution statuses: allowed, requires_approval, denied.
- Expose `hadara policy preflight-shell <command> --json`.
- Return exit code `2` for denied preflight.
- Do not execute shell commands.
- Add focused tests and Docker CLI smokes.

## Out of Scope

- ShellTool execution.
- Approval prompt implementation.
- Audit log persistence for preflight.
- Full POSIX or PowerShell parser.
- Remote approval workflow.

## Status

Done
