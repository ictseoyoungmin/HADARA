# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make `hadara session start --json` default to bounded no-live context-pack metadata. | Accepted | The initial live-default design timed out on the mounted workspace after 45s, so routine session startup must not trigger broad graph/context-pack discovery. | Failed `ev:T-0378:b530c04adb3e4d50ac3ef0b4`; resolved by `ev:T-0378:dd42b8f8ded34d988a2090a1`. |
| D-2 | Keep full context-pack graph discovery behind explicit `--live`. | Accepted | C5 callers may still need a richer live packet, but the slow path must be opt-in and visible in command guidance. | `ev:T-0378:b3e1cc3b1b6d44b4a68c9bf0`, `ev:T-0378:dd42b8f8ded34d988a2090a1` |
