# Context

The bootstrap CLI currently uses a small `getOption()` helper that returns the next token without checking whether it is another flag. This can make inputs like `--task --json` or `--script --max-steps` behave unpredictably.

T-0025 is a small parser extraction rather than a full command router rewrite.
