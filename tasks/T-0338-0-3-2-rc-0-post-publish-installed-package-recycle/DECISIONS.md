# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use temp-prefix installed bin as canonical consumer proof. | Accepted | Exact `npx hadara@0.3.2-rc.0` resolved a stale fnm/global shim reporting `0.3.0-rc.2`, while the isolated prefix installed package reported `0.3.2-rc.0`. | `ev:T-0338:59d881bdd12749f6a3a1ea87` |
| D-2 | Treat the `npx` result as an environment finding, not a package blocker. | Accepted | `docs/TEST_STRATEGY.md` already identifies temp-prefix installed bin as canonical when `npx`/PATH/cache behavior may be stale. | exact npx smoke output; installed-bin version proof |
