# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `PYTHONPATH=/tmp/hadara-python-t0276-deps:src python3 -m pytest` from `python/` | Re-run Python bridge tests after version alignment. | Yes | Passed | 7 tests passed. |
| `PYTHONPATH=/tmp/hadara-python-t0276-deps:python/src python3 - <<'PY' ...` from repo root | Confirm `pyproject.toml` and runtime `hadara.__version__` both report `0.2.0rc1`. | Yes | Passed | Printed `0.2.0rc1` twice. |
| `PYTHONPATH=/tmp/hadara-python-t0276-deps python3 -m build --outdir /tmp/hadara-t0278-dist --no-isolation` from `python/` | Verify build artifacts use `0.2.0rc1` without mutating registries. | Yes | Passed | Built `hadara-0.2.0rc1.tar.gz` and `hadara-0.2.0rc1-py3-none-any.whl`. |
| `PYTHONPATH=/tmp/hadara-python-t0276-deps python3 -m twine check /tmp/hadara-t0278-dist/*` from `python/` | Validate built sdist/wheel metadata. | Yes | Passed | Both artifacts passed. |
| `python3 -m pip install --target /tmp/hadara-t0278-install-check --no-deps /tmp/hadara-t0278-dist/hadara-0.2.0rc1-py3-none-any.whl` | Smoke install the wheel into a disposable target directory. | Yes | Passed | Installed `hadara-0.2.0rc1`; pip emitted a cache-permission warning only. |
| `PYTHONPATH=/tmp/hadara-t0278-install-check python3 -c "import hadara; print(hadara.__version__)"` | Confirm installed package reports `0.2.0rc1`. | Yes | Passed | Printed `0.2.0rc1`. |
| `rg -n "0\\.0\\.1" python .github/workflows/python-publish.yml docs/PYPI_TRUSTED_PUBLISHING.md \|\| true` | Confirm old publish-facing version is gone. | Yes | Passed | No matches. |
| `git diff --check` | Whitespace/patch hygiene. | Yes | Passed | No whitespace errors. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| PyPI/TestPyPI upload | No | This task only aligns version metadata before operator-dispatched publish. | Not Run | Boundary preserved. |
| Token/secret loading | No | Trusted Publisher uses GitHub OIDC during workflow runs; no local token is needed. | Not Run | Boundary preserved. |
| GitHub Actions publish execution | No | Real publish remains an external manual dispatch after repo push and PyPI setup. | Not Run | Boundary preserved. |
