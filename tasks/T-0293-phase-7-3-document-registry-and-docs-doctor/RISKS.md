# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Registry can become stale when project-specific docs are added outside init. | Docs doctor may warn or infer incomplete guidance. | Medium | `docs doctor` reports missing/unregistered documents; Phase 7.4/7.5 can add managed patch/regeneration paths. | Open follow-up |
| Standard wrapper validation timeout persists. | Full wrapper baseline unavailable for this capsule. | Medium | Direct Docker TypeScript build, focused tests, and built CLI smokes passed; blocked wrapper evidence recorded. | Recorded |
