# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Legacy evidence ids are line-fallback compatibility ids. | They can change if historical JSONL lines are reordered or edited. | High for legacy records | Preserve normalizer metadata (`idSource`, `idStability`, `persistedSchemaVersion`) and treat durable `ev:` ids as the only long-lived references. | Accepted |
| Older close evidence may lack `close-proof` tags. | `CLOSES_WITH` edges may be absent for historical records even when task audit logic can derive close state elsewhere. | Medium | Keep this extractor tag-explicit; graph builder/state projection can layer derived close proof logic later if needed. | Carry Forward |
| Evidence dependency edges depend on exact `resolves:` / `supersedes:` tags. | Free-text evidence summaries are intentionally not interpreted as proof relationships. | Medium | Use explicit marker tags only and leave heuristic text matching out of C1 evidence extraction. | Accepted |
