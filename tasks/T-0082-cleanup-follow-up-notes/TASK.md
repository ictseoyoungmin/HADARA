# T-0082 Cleanup Follow-up Notes

## Goal

Capture cleanup gaps from T-0075, T-0079, T-0080, and T-0081 before continuing broader service/read-model hardening.

## Scope

- Document redaction policy observability follow-up for medium findings and evidence artifact policy path coverage.
- Document schema strictness levels for fixture, contract, and release-gate use.
- Document `task.read` embedded `evidenceIndex` normalization/security follow-up.
- Document that T-0081 Policy Service Parity is report-builder parity, not the final v1.0 authorization service.
- Normalize `createPolicyCheckReport()` mode input with `createPolicyEvaluateReport()`.

## Out of Scope

- No runtime schema validation or release gate implementation.
- No redaction registry injection implementation.
- No task.read evidenceIndex parser rewrite.
- No policy matrix refactor, actor/surface authorization model, provider action authorization, or CLI `--` delimiter parser.

## Status

Done
