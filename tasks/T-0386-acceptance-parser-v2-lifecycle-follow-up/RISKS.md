# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Acceptance parser v2 becomes too permissive. | Required work could be deferred lazily. | Medium | Legacy rows default to required/non-deferrable; non-deferrable deferred rows block. | Mitigated |
| Existing ready/close consumers break on changed issue codes. | Lifecycle UX regression. | Medium | Keep existing public issue codes and add blocker details in messages. | Mitigated |
| V2 table format fails old capsule structural checks. | Done-level validation blocks valid v2 acceptance tables. | Medium | Accept v2 header marker in format validation and cover with harness test. | Mitigated |
