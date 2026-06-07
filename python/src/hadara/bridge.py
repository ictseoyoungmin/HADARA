"""Helpers for bridging Python console entry points to the HADARA npm CLI.

The first PyPI preview intentionally avoids resolving a global ``hadara``
binary. A Python console-script named ``hadara`` may point back to this package,
so blindly executing ``shutil.which("hadara")`` can recurse into the wrapper.
The bridge therefore uses a pinned ``npx`` invocation until a later release can
implement and test safe self-wrapper exclusion.
"""

from __future__ import annotations

from collections.abc import Sequence

from .version import NPM_RUNTIME_SPEC


def build_npx_command(args: Sequence[str]) -> list[str]:
    """Return the subprocess command used to invoke the Node.js runtime.

    Args:
        args: CLI arguments that should be forwarded to HADARA.

    Returns:
        A command list suitable for ``subprocess.call``.
    """

    return ["npx", "-y", NPM_RUNTIME_SPEC, *args]
