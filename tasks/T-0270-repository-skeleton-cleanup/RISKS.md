# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| A deleted root launcher is still used by a local operator habit. | Local convenience command no longer works. | Medium | Removed only root dev wrappers; npm/built CLI flows and package bin metadata remain. | Mitigated |
| Historical specs still mention launcher names. | Search output can look noisy after deletion. | High | Left historical/portable packaging references unchanged and documented them as non-active root-file usage. | Accepted |
| Hermes compatibility files are mistaken for unused bootstrap files. | Removing them would weaken documented integration context. | Low | Kept `.hadara/`, `.hermes.md`, `HERMES.md`, and Hermes examples out of scope and verified they remain. | Mitigated |
| Cleanup work overlaps with T-0269 publish state. | Release evidence could become ambiguous. | Medium | Did not edit T-0269 publish scripts/evidence in this capsule. | Mitigated |
