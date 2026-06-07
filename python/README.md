# HADARA for Python

This is a preview Python bridge package for HADARA.

The current implementation delegates to the official Node.js HADARA runtime. It
requires Node.js 22+ and `npx`.

If you want the primary runtime, use:

```bash
npm install -g hadara@0.2.0-rc.1
```

Then run:

```bash
hadara doctor --json
```

## Install

```bash
pip install hadara
```

The installed `hadara` command is a Python console-script wrapper. It checks
that Node.js 22+ and `npx` are available, then delegates to the pinned npm
runtime:

```bash
npx -y hadara@0.2.0-rc.1 <args>
```

For example:

```bash
hadara --help
hadara --version
hadara doctor --json
```

## Missing Node.js

If Node.js or `npx` is missing, the wrapper exits with code `127` and prints a
clear setup message instead of failing with a Python traceback.

Recommended setup:

```bash
npm install -g hadara@0.2.0-rc.1
```

## Scope

This package is intentionally small:

- It is not a Python-native HADARA runtime.
- It does not publish npm packages, upload to PyPI, create releases, or run
  installers.
- It is a bridge package so Python users can discover the official HADARA CLI
  path and use a familiar `pip install hadara` entry point.

A Python-native runtime or SDK may be added later under modules such as
`hadara.protocol`, `hadara.evidence`, or `hadara.handoff`.

## Development

Run these commands from the `python/` directory:

```bash
python -m pip install -U pip build twine pytest
python -m pip install -e .
python -m pytest
python -m build
python -m twine check dist/*
```
