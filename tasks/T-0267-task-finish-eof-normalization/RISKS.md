# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Normalization could change planned hashes if applied only at execute time. | Finish execute would fail after-hash checks. | Low | Apply normalization inside `nextWriteContent()`, shared by dry-run planning and execute. | Mitigated |
| Broad trimming could rewrite intentional document body whitespace. | Unexpected formatting changes. | Low | Only trim trailing whitespace/blank lines at EOF and add one final newline. | Mitigated |
