# Risks

| Risk | Mitigation |
|---|---|
| Status JSON schema or dashboard fixture behavior changes accidentally. | Keep the refactor behavior-preserving and run focused status tests plus full check. |
| Existing imports of `src/cli/status-json.ts` break. | Leave a compatibility re-export in place. |
