# Risks

| Risk | Mitigation |
|---|---|
| Cleanup weakens release readiness checks too much. | Keep required marker list and only relax current-version/tarball example matching. |
| Historical evidence is rewritten accidentally. | Do not edit validation history or completed task evidence for this cleanup. |
| Future RC regression is not proven. | Add focused unit coverage with a different `0.1.0-rc.N` package version and matching docs. |
