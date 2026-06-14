# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Hand-authored registry JSON could drift from init/migration behavior. | Future docs registry consumers may see source-checkout behavior that differs from fresh init. | Medium | Generate artifacts through existing docs-registry service output. | Mitigated |
| Broad self-migration execute could rewrite unrelated HADARA-dev docs. | T-0313 would exceed focused artifact policy scope. | Medium | Run migration dry-run only and commit only registry artifacts. | Mitigated |
| `docs/DOC_REGISTRY.md` projection is not itself registered as a document entry by the current seed. | `docs explain --path docs/DOC_REGISTRY.md` reports `DOC_NOT_REGISTERED`. | Low | Treat as current seed behavior; avoid schema/seed change in this capsule and revisit only if operators need self-registration. | Accepted |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
