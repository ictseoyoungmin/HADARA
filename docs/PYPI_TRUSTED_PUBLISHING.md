# PyPI Trusted Publishing

This runbook covers the HADARA Python bridge package under `python/`.

The package name is `hadara`, the Python bridge version is `0.2.0rc1`, and the
official runtime remains the npm package `hadara@0.2.0-rc.1`.

## Boundary

Trusted Publishing uses GitHub Actions OIDC. Do not create, store, or commit a
PyPI API token for this workflow.

Publishing must be manually dispatched. The repository workflow intentionally
does not publish on `push`, `pull_request`, tag creation, or GitHub Release
publication.

## Workflow

| Field | Value |
|---|---|
| Workflow file | `.github/workflows/python-publish.yml` |
| Workflow filename for PyPI | `python-publish.yml` |
| GitHub owner | `ictseoyoungmin` |
| GitHub repository | `HADARA-dev` |
| Package directory | `python/` |
| Package name | `hadara` |
| Python package version | `0.2.0rc1` |
| TestPyPI environment | `testpypi` |
| PyPI environment | `pypi` |

The workflow has one manual input named `target`:

| Target | Publishes To | Environment | Notes |
|---|---|---|---|
| `testpypi` | `https://test.pypi.org/legacy/` | `testpypi` | Default; run this first. |
| `pypi` | `https://upload.pypi.org/legacy/` through the PyPA action default | `pypi` | Real public publish; protect this environment. |

The workflow also has `expected_version`, defaulting to `0.2.0rc1`. The build
job fails if `python/pyproject.toml` contains a different version.

## PyPI Setup

Because `hadara` is not published on PyPI yet, configure a pending publisher on
PyPI before the first real publish. A pending publisher does not reserve the
project name until it is used for the first publish.

On PyPI:

| Field | Value |
|---|---|
| Project name | `hadara` |
| Publisher | GitHub Actions |
| Organization or user | `ictseoyoungmin` |
| Repository | `HADARA-dev` |
| Workflow filename | `python-publish.yml` |
| Environment name | `pypi` |
| Allowed actions | Select package publishing/upload. |

Create the matching GitHub environment named `pypi` and require manual approval
before deployment.

## TestPyPI Setup

Configure TestPyPI separately before the first test publish.

On TestPyPI:

| Field | Value |
|---|---|
| Project name | `hadara` |
| Publisher | GitHub Actions |
| Organization or user | `ictseoyoungmin` |
| Repository | `HADARA-dev` |
| Workflow filename | `python-publish.yml` |
| Environment name | `testpypi` |
| Allowed actions | Select package publishing/upload. |

Create the matching GitHub environment named `testpypi`. Approval can be lighter
than `pypi`, but it should still be explicit.

## Operator Flow

1. Ensure the workflow file exists on the branch you will run from.
2. Configure the pending publisher on TestPyPI using the exact values above.
3. In GitHub Actions, run `Python Publish` with:
   - `target`: `testpypi`
   - `expected_version`: `0.2.0rc1`
4. Verify TestPyPI install in a disposable environment:

```bash
python -m pip install --index-url https://test.pypi.org/simple/ --no-deps hadara==0.2.0rc1
hadara --help
hadara doctor --json
```

5. Configure the pending publisher on PyPI using the exact values above.
6. In GitHub Actions, run `Python Publish` with:
   - `target`: `pypi`
   - `expected_version`: `0.2.0rc1`
7. Verify real PyPI install in a disposable environment:

```bash
python -m pip install --no-cache-dir hadara==0.2.0rc1
hadara --help
hadara doctor --json
```

Record the workflow run URL, target, version, publish result, and install smoke
results in the active Task Capsule evidence.

## Notes

- The PyPI and TestPyPI publisher registrations are separate.
- The GitHub environment name is part of the trusted identity when configured;
  `pypi` and `testpypi` must match the workflow job environment names exactly.
- The workflow uses the official PyPA publish action with job-level
  `id-token: write`.
- If the PyPI project already exists later, manage Trusted Publishers from that
  project's Publishing page instead of using a pending publisher.
