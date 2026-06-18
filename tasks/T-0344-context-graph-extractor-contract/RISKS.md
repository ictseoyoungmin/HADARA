# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Contract helpers could overfit future extractors before real source extraction exists. | Later extractor capsules might need API churn. | Medium | Keep the interface small, synchronous, and pure; cover only deterministic source/id/merge/count behavior required by the C1 spec. | Mitigated. |
| Edge and known-problem id normalization could produce unstable graph ids if whitespace/path handling is inconsistent. | Graph consumers could see noisy changes across rebuilds. | Medium | Normalize paths and whitespace before hashing; focused tests cover repeated equivalent inputs. | Mitigated. |
| This capsule could accidentally imply a complete graph implementation. | Operators might expect context graph CLI output before extractors and graph builder exist. | Low | Handoff and acceptance explicitly state no source-specific extractors or CLI surfaces were added. | Mitigated. |
