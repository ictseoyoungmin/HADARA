export function formatLocalMinuteTimestamp(date = new Date()): string {
  // Task metadata is written by both host and container processes. Use one
  // explicit UTC representation so Created/Updated ordering is not affected
  // by the process timezone.
  return `${date.toISOString().slice(0, 16)}Z`;
}

export function formatLocalDate(date = new Date()): string {
  return formatLocalMinuteTimestamp(date).slice(0, 10);
}
