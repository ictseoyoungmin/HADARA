# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `pyproject.toml` read-only parser detects package name/version from PEP 621 or Poetry metadata. | Done | Unit coverage for `[project]` and `[tool.poetry]`. |
| AC-2 | Build backend detection returns setuptools, poetry, hatch, flit, or unknown. | Done | Unit coverage for setuptools, poetry, hatch, flit, and release dry-run unknown case. |
| AC-3 | Python preview exposes planned commands only: `python -m build`, `twine check`, and `pip install wheel`. | Done | Built CLI smoke confirmed commands with `willExecute:false`. |
| AC-4 | No Python command execution, PyPI token loading, publish, artifact mutation, or evidence attachment is added. | Done | Preview metadata only; release dry-run privacy/mutation boundaries unchanged. |
| AC-5 | Tests/evidence/handoff are updated. | Done | Evidence `ev:T-0247:2e79dc1f8b4b4896bb5af646`; docs updated. |
