# Acceptance Criteria

- [x] `hadara smoke clean-checkout --execute --json` runs the clean-checkout source sequence in a disposable copy.
- [x] The command preserves the current source workspace and keeps installed CLI/package-install smoke separate.
- [x] The report is reduced, schema-valid, redacted, and excludes raw logs, private paths, environment secrets, publish/release mutation, package artifacts, and evidence writes.
- [x] Default cleanup removes the disposable workspace; `--keep-temp` retains local/private temporary content with redacted public paths only.
- [x] Focused and full Docker validation are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
