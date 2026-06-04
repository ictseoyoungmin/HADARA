# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Config preview is mistaken as applied release support. | Operators may assume Python/Docker publish exists. | Medium | Report `supported:false` for unsupported primary requests and keep effective primary npm. | Mitigated |
| pyproject detection auto-promotes Python. | Violates release sequencing. | Low | Unit test pyproject-only case. | Mitigated |
