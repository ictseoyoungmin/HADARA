# Context

Review feedback found that `isSafeShellCommand()` treats safe command arrays as prefixes, so commands like `npm run check extra` are classified as safe. This task makes safe commands exact until explicit suffix rules are designed.
