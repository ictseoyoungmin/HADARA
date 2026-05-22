# Risks

| Risk | Mitigation |
|---|---|
| Tightening option parsing could reject an existing odd workflow. | Limit strict checks to named options that require values. |
| Shell command arguments can look like flags. | Keep shell command extraction positional; only parse known command options strictly. |
| Parser extraction could grow too large. | Avoid full routing rewrite in this slice. |
