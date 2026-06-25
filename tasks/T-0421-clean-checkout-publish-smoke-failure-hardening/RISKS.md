# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Legacy `/api/debt` consumers expected the full operational-debt schema. | Additive dashboard users could see a schema change on a legacy route. | Medium | `/api/dashboard/debt` already defines the dashboard projection contract; full operational-debt remains available through diagnostic surfaces. | Accepted |
| Clean-checkout smoke run from `/tmp/hadara` can fail doctor because that dev validation copy omits `.hadara/context`. | False negative if the synthetic dev copy is treated as the release source. | Medium | Validate release retry from the git-backed `/root/hadara-publish` clone after committing T-0421; record this boundary in evidence. | Carry Forward |
| Mounted workspace clean-checkout validation can hang or run far beyond useful release timing. | Slow feedback loop and orphan smoke processes. | Medium | Use ext4 publish clone/release helper for final release proof; keep mounted broad smoke out of the hot loop. | Mitigated |
