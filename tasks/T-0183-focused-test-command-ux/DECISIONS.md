# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `test:focused` as `vitest run`. | Accepted | It passes file paths directly without preloading the whole unit suite argument. | `package.json`; focused smoke evidence. |
| D-2 | Keep `test:unit` unchanged. | Accepted | Existing broad unit suite command remains useful and stable. | `package.json`. |
| D-3 | Document focused tests as supplemental. | Accepted | Done evidence still requires full validation. | SOP and Test Strategy. |
