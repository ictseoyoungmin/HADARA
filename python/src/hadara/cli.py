"""Console entry point for the HADARA Python bridge.

The ``hadara`` command installed by this package is a small, friendly wrapper
around the official Node.js runtime. It validates that Node.js 22+ and ``npx``
are available, emits a clear setup message when they are not, and otherwise
delegates all arguments to the pinned npm release.
"""

from __future__ import annotations

from collections.abc import Sequence
import shutil
import subprocess
import sys

from .bridge import build_npx_command
from .version import MINIMUM_NODE_MAJOR, MINIMUM_NODE_VERSION, NPM_RUNTIME_SPEC


MISSING_RUNTIME_MESSAGE = f"""HADARA Python package is currently a bridge to the official Node.js runtime.

Node.js {MINIMUM_NODE_VERSION}+ and npx are required for this preview release.

Recommended install:
  npm install -g {NPM_RUNTIME_SPEC}

Then run:
  hadara doctor --json

A Python-native runtime is planned.
"""


def _detect_node_major_version(node_path: str) -> int | None:
    """Return the Node.js major version for a resolved executable path.

    The bridge intentionally keeps this probe small and side-effect-free:
    ``node --version`` should only print a version string such as ``v22.16.0``.
    If the executable cannot run or prints an unexpected value, ``None`` is
    returned so the caller can fail with the same friendly setup message.
    """

    try:
        output = subprocess.check_output(
            [node_path, "--version"],
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=2,
        )
    except (OSError, subprocess.SubprocessError):
        return None

    version = output.strip()
    if version.startswith("v"):
        version = version[1:]

    major_text = version.split(".", 1)[0]
    if not major_text.isdigit():
        return None

    return int(major_text)


def main(argv: Sequence[str] | None = None) -> int:
    """Run HADARA through the official npm runtime.

    Args:
        argv: Optional argument sequence. When omitted, ``sys.argv[1:]`` is
            forwarded.

    Returns:
        The subprocess exit code, or ``127`` when Node.js 22+/npx are
        unavailable.
    """

    forwarded_args = list(sys.argv[1:] if argv is None else argv)
    node = shutil.which("node")
    npx = shutil.which("npx")

    if node is None or npx is None:
        print(MISSING_RUNTIME_MESSAGE, file=sys.stderr, end="")
        return 127

    node_major_version = _detect_node_major_version(node)
    if node_major_version is None or node_major_version < MINIMUM_NODE_MAJOR:
        print(MISSING_RUNTIME_MESSAGE, file=sys.stderr, end="")
        return 127

    return subprocess.call(build_npx_command(forwarded_args))


if __name__ == "__main__":
    raise SystemExit(main())
