# Decisions

| Decision | Rationale |
|---|---|
| Support both `hadara status --json` and `hadara ops status --json`. | `status` is concise for humans; `ops status` leaves room for future operations subcommands. |
| Build the report from existing docs and Task Capsules. | This preserves current HADARA source-of-truth boundaries. |
| Commit the selected mockup as a reference artifact. | The file is small enough for current development and useful for future dashboard contract work. |
