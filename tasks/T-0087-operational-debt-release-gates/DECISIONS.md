# Decisions

- Keep operational debt records static for this slice; persisted or externally editable debt remains deferred until the project-store boundary is designed.
- Treat `tracked` and `candidate` debt as open for aggregate and release-gate warning purposes; `mitigated` debt is closed.
- Release-gate behavior is warning-only for open high-severity operational debt. Blocking semantics remain deferred until false-positive risk is lower.
- `hadara release gate --json` is a read-only readiness report and does not execute release, packaging, shell, provider, or deployment actions.
