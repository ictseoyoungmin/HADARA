# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | package smoke and clean-checkout smoke pass for current rc.3 source in the Docker baseline. | Met | package smoke all steps passed; clean-checkout ok:true with `check` exit 0. |
| AC-2 | Release gates are green: release gate strict ok, release dry-run ready with 0 blockers, release publish dry-run ok with no mutation. | Met | release gate/dry-run/publish dry-run evidence. |
| AC-3 | Package is publish-ready and has been published to npm at rc.3. | Met | name hadara, version 0.2.0-rc.3, private false; publish complete and `npm view` verified `0.2.0-rc.3`. |
| AC-4 | Publish was executed through the operator helper and confirmed successful (GitHub draft intentionally skipped). | Met | `manual publish` evidence record; `npm view` verified version visibility. |
