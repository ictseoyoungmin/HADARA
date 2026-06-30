# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Derived metadata axes may not capture future explicit registry metadata perfectly. | Later read-map consumers may need richer persisted metadata. | Medium | Prefer explicit registry fields when present; otherwise derive from current stable fields. | Accepted |
| Current repo has many historical unregistered specs. | `docs inbox` can be noisy. | Medium | Surface as warnings, not blockers; keep cleanup as separate docs-governance work. | Accepted |
| Read-map could broaden default spec reading. | Agents may over-read specs. | Low | Only task-matching specs and required/task-start docs go to `readFirst`; unregistered specs go to `doNotReadByDefault`. | Mitigated |
