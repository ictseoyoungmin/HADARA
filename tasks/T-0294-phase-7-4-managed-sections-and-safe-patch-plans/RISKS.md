# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| `docs patch` currently replaces whole section bodies, not semantic table rows. | Operators must provide the complete managed body for now. | Medium | Patch reports include before/after excerpts and hashes; row-level helpers can be added later without widening boundaries. | Open follow-up |
| Standard wrapper validation timeout persists. | Full wrapper baseline unavailable for this capsule. | Medium | Direct Docker TypeScript build, focused tests, and built CLI smokes passed; blocked wrapper evidence recorded. | Recorded |
