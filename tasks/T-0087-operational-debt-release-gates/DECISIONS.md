# Decisions

- Keep operational debt records static for this slice; persisted or externally editable debt remains deferred until the project-store boundary is designed.
- Treat `tracked` and `candidate` debt as open for aggregate and release-gate warning purposes; `mitigated` debt is closed.
- Release-gate behavior is mode-based for open high-severity operational debt: `advisory` warns and keeps `ok: true`, while `strict` reports an error and sets `ok: false`.
- `hadara release gate --mode advisory|strict --json` is a read-only readiness report and does not execute release, packaging, shell, provider, or deployment actions.
