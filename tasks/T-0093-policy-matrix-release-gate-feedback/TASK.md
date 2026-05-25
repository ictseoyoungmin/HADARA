# T-0093 Policy Matrix Release Gate Feedback

## Goal

Verify and harden the T-0090 policy matrix/release-gate feedback path, especially release-risk commands, network-risk commands, and strict release-gate process exit behavior.

## Scope

- Confirm `npm publish` is denied outside release mode and approval-gated in release mode.
- Confirm network commands require approval in auto/trusted modes.
- Keep strict release-gate CLI failures returning process exit code 6.
- Add focused regression coverage where the existing tests are too implicit.
- Record evidence for the feedback review.

## Out of Scope

- Private evidence absolute source policy changes.
- Active-run schema assertion/degraded-error split.
- New schema fixtures for private evidence or release gates.
- Provider, shell execution, dashboard, or broad MCP write behavior.

## Status

Done
