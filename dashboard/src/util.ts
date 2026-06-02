// Small presentation helpers. No DOM mutation, no storage.

export function relativeTime(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return '';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const diff = Math.max(0, now - t);
  const s = Math.round(diff / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'muted';

export function healthTone(health: string): Tone {
  if (health === 'ok') return 'ok';
  if (health === 'degraded') return 'warn';
  if (health === 'error') return 'danger';
  return 'muted';
}

export function healthLabel(health: string): string {
  if (health === 'ok') return 'Healthy';
  if (health === 'degraded') return 'Degraded';
  if (health === 'error') return 'Error';
  return 'Unknown';
}

export function proofTone(status: string): Tone {
  if (status === 'sufficient') return 'ok';
  if (status === 'failed' || status === 'blocked') return 'danger';
  if (status === 'weak' || status === 'private-only') return 'warn';
  return 'muted';
}

export function proofLabel(status: string): string {
  if (status === 'private-only') return 'PRIVATE-ONLY';
  return status.toUpperCase();
}

export function sourceTone(kind: string): Tone {
  if (kind === 'live-api' || kind === 'live-status') return 'ok';
  if (kind === 'fixture-fallback' || kind === 'inline-fallback') return 'warn';
  if (kind === 'degraded') return 'warn';
  return 'info';
}

export function sourceLabel(kind: string): string {
  switch (kind) {
    case 'live-api':
      return 'live';
    case 'live-status':
      return 'live (status)';
    case 'fixture-fallback':
      return 'fixture';
    case 'inline-fallback':
      return 'offline';
    case 'degraded':
      return 'degraded';
    default:
      return kind;
  }
}

export function severityTone(severity: string): Tone {
  if (severity === 'ok') return 'ok';
  if (severity === 'warning') return 'warn';
  if (severity === 'error') return 'danger';
  return 'info';
}

// "| Step | Reason |..." style table fragments leak out of some read models;
// treat anything that looks like a markdown table row as no real recommendation.
export function cleanRecommendation(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('|') || /^-+$/.test(trimmed)) return null;
  return trimmed;
}
