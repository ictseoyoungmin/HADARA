# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release mutation runs without explicit approval. | Could publish the wrong package version or expose release-state ambiguity. | Medium | Do not run `release publish --mode execute`, manual publish script, `npm publish`, or `npm view` after publish without explicit approval. | Mitigated so far |
| Token values leak into committed evidence. | Could expose npm or GitHub credentials. | Low | Check token presence by name only; never print token values or raw environment. | Mitigated so far |
| README top image works in repo but not npm package. | Published README could show a broken image if the asset is only a relative package path and not included in `files`. | Medium | Use a GitHub raw URL for README image and ensure `docs/assets/hadara_sub_right_name.png` is committed/pushed before publish; otherwise include the asset in package files and refresh artifact evidence. | Open |
| README changes invalidate T-0268 release artifact freshness for actual publish. | Package contents could differ from the release artifact evidence used for readiness. | High | Commit README/asset changes, then regenerate package smoke, clean-checkout, release artifact, release dry-run, and publish dry-run evidence before actual npm publish. | Open |
| `release publish --mode execute` is not a real npm publisher in current code. | Operator may expect the command to publish when it currently reports/audits and blocks before mutation. | High | Use it only as an approval-gate report; actual npm publish requires the manual publish script or future mutation-capable runner with explicit approval. | Open |
| Manual publish evidence attaches to the wrong capsule. | Publish evidence could be recorded under stale T-0143 if the helper default is reused. | Medium | `manual-publish-rc.sh` now requires an explicit task id and no longer defaults to T-0143. | Mitigated |
