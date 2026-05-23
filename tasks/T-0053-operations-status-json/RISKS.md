# Risks

| Risk | Mitigation |
|---|---|
| T-0053 accidentally starts dashboard implementation. | Keep scope to JSON contract and read model only. |
| The status report duplicates source-of-truth state incorrectly. | Read from existing docs and Task Capsules rather than introducing new state. |
| The mockup becomes treated as implementation source. | Add design docs that mark it as visual reference only. |
| Large mockups bloat the repo. | Track only the selected reference HTML and keep other mockups ignored. |
