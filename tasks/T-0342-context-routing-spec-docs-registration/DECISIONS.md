# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Register 0.3.3 context-routing specs as conditional reference docs instead of default Required Reading. | Accepted | Keeps session startup compact while making context-routing work discoverable from SOP and docs registry. | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |
| D-2 | Add `.gitignore` exceptions for `docs/specs/0.3.3/**`. | Accepted | Existing `docs/specs/*` ignore rule hid the new spec line; docs registration should point at committed docs. | `ev:T-0342:19cd8d65d2e94ee1a605c0f2` |
