# Risks

| Risk | Mitigation |
|---|---|
| The guard could reject intentionally concise task docs. | Check only exact scaffold placeholders/default empty structures, not arbitrary short content. |
| Draft capsule creation could become noisy. | Run scaffold checks only at done level. |
| Existing completed fixtures may fail because helper setup leaves scaffold docs unchanged. | Update focused fixtures to reflect realistic completed capsule documentation. |
