# Risks

| Risk | Mitigation |
|---|---|
| Executor behavior conflicts with future provider profiles. | Keep this executor profile-agnostic and ordered by caller input. |
| Error normalization is inconsistent across providers. | Use each provider's `normalizeError` when needed and preserve ProviderError-like values. |
| Scope expands into streaming fallback. | Limit this slice to `chat` requests only. |

