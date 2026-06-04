# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release dry-run emits target configuration preview with npm primary, Python preview, Docker deferred, and `autoPromotion:false`. | Done | Unit tests and built CLI smoke. |
| AC-2 | `pyproject.toml` detection alone does not promote Python primary. | Done | `detects pyproject.toml as a read-only Python release target preview` test asserts primary remains npm. |
| AC-3 | A config file requesting Python primary is reported as unsupported and effective primary remains npm. | Done | `previews release target config requests without promoting Python primary` test. |
| AC-4 | No publish mutation, PyPI token, Docker build, or GitHub release execution is added. | Done | Release dry-run remains read-only and mutation flags false. |
| AC-5 | Evidence is attached and handoff/docs are updated. | Done | Evidence `ev:T-0251:975fee99407d43149a0a492a`; project state, slices, and handoff updated. |
