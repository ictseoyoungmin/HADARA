# Decisions

- Keep Overview parity as a renderer-only change. No read-model contract or core service changes are required unless implementation discovers missing data.
- Treat "Tasks height matches Detail" as matching the total panel height: task table rows are calculated from the Detail panel's document-row policy plus the fixed difference between the two panel layouts.
