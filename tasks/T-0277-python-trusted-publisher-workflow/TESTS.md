# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `PYTHONPATH=/tmp/hadara-python-t0276-deps:src python3 -m pytest` from `python/` | Re-run Python bridge tests used by the publish workflow. | Yes | Passed | 7 tests passed. |
| `PYTHONPATH=/tmp/hadara-python-t0276-deps python3 -m build --no-isolation` from `python/` | Rebuild local Python distributions for workflow parity. | Yes | Passed | Built `hadara-0.0.1.tar.gz` and `hadara-0.0.1-py3-none-any.whl`. |
| `PYTHONPATH=/tmp/hadara-python-t0276-deps python3 -m twine check dist/*` from `python/` | Validate Python distribution metadata/readme rendering. | Yes | Passed | Both sdist and wheel passed. |
| `git diff --check` | Whitespace/patch hygiene. | Yes | Passed | No whitespace errors. |
| `rg -n "^  push:\|^  pull_request:\|^  release:\|^  schedule:" .github/workflows/python-publish.yml \|\| true` | Confirm the publish workflow has no non-manual trigger stanza. | Yes | Passed | No matches. |
| `rg -n "workflow_dispatch\|id-token: write\|environment:\|pypa/gh-action-pypi-publish\|repository-url: https://test.pypi.org/legacy/" .github/workflows/python-publish.yml` | Confirm required Trusted Publisher workflow markers. | Yes | Passed | Manual trigger, job-level OIDC permission, environments, PyPA action, and TestPyPI repository URL present. |
| `command -v actionlint \|\| true` | Check whether a dedicated GitHub Actions linter is locally available. | No | Not Available | `actionlint` is not installed in this environment; static boundary checks were used instead. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| GitHub Actions publish execution | No | This capsule prepares the workflow only; actual publish must be operator-dispatched after PyPI/TestPyPI web setup. | Not Run | Boundary preserved. |
| PyPI/TestPyPI upload | No | Registry mutation remains outside local implementation validation. | Not Run | Boundary preserved. |
| Token/secret loading | No | Trusted Publisher uses GitHub OIDC during workflow runs and stores no PyPI token in the repo. | Not Run | Boundary preserved; workflow has no token/password inputs. |
