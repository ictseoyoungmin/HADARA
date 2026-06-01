# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement evidence semantics as read-model foundations over `hadara.evidence.v1`. | Accepted | Preserves existing proof history and keeps writer migration separate. | docs/SCHEMAS.md |
| D-2 | Keep lint/protocol/harness integration out of T-0186. | Accepted | T-0186 establishes tested shared semantics; T-0187/T-0188 wire consumers. | docs/DEVELOPMENT_SLICES.md |
| D-3 | Do not resolve failed evidence from free-text `resolved`/`fixed` wording. | Accepted | Exact markers or later passed same-category evidence reduce false resolution. | docs/TEST_STRATEGY.md |
