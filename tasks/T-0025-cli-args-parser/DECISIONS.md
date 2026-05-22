# Decisions

- T-0025 extracts option helpers but keeps existing command routing.
- Named options with values cannot consume another `--flag` token as their value.
- `--max-steps` remains bounded to integers from 1 through 32.
