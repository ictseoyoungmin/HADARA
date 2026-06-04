# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Handoff prose is ambiguous. | `task next` could emit a vague recommendation. | Medium | Uses explicit `Next Recommended Step` rows, sourceKind, and createCommand guidance; fallback sources remain visible. | Mitigated |
| Board fallback is hidden too aggressively. | Operators may miss old Partial/backlog work. | Medium | Added non-primary `backlog` metadata. | Mitigated |
| Existing projects relying on Task Board-only flow regress. | Smaller projects may have no handoff next direction. | Low | Existing Development Slices and Task Board fallback tests remain passing. | Mitigated |
| Report shape becomes breaking. | Consumers may depend on existing fields. | Low | Added fields only; existing `recommendations` and `summary.source` remain. | Mitigated |
