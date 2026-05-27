# Decisions

- Initial startup now uses a synthetic loading read model so the terminal can draw a read-only loading screen before full project state is available.
- Loading animation remains in the terminal renderer layer and advances through several frames before synchronous read-model loads; a future worker-thread pass can make long reads animate continuously while work runs off the main thread.
- Mouse support is intentionally small: SGR left-clicks only, mapped to panels, task rows, and detail document tabs.
- Resize support only redraws the current frame; it does not mutate project/cache state.
