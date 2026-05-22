# Context

Codebase feedback identified `src/cli/main.ts` as the largest concentration point. It currently mixes command dispatch with command-specific behavior. This task begins the split conservatively by moving the self-contained init and run scaffold helpers out of the dispatcher.

This follows after T-0028 and T-0030, which added those helpers.
