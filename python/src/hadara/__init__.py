"""Preview Python bridge package for HADARA.

The package currently delegates command execution to the official Node.js
HADARA runtime. It exists so Python users have an official package name and a
clear path to the primary CLI while Python-native modules are still future
work.
"""

from .version import NPM_RUNTIME_SPEC, __version__

__all__ = ["NPM_RUNTIME_SPEC", "__version__"]
