# Risks

| Risk | Mitigation |
|---|---|
| Reclassifying debt too early could hide unresolved process risk. | Only close the two high records whose target safeguards already exist and keep deferred persistence/mutation scope documented. |
| Strict release gate could appear to execute release behavior. | Preserve the existing read-only release-gate implementation and tests. |
| Capsule acceptance could be checked before evidence. | Record validation first, then mark acceptance complete before done-level harness validation. |
