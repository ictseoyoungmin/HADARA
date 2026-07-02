import { STATUSES, PRIORITIES, OWNERS, todayIso } from './schema.js';

export function buildReadinessReport(items) {
  const decorated = items.map(item => ({ ...item }));
  const statusCounts = countBy(decorated, 'status', STATUSES);
  const priorityCounts = countBy(decorated, 'priority', PRIORITIES);
  const ownerCounts = countBy(decorated, 'owner', OWNERS);
  const blockers = decorated.filter(item => item.blocked);
  const overdue = decorated.filter(item => item.daysUntilDue < 0 && item.status !== 'Done');
  const dueSoon = decorated.filter(item => item.daysUntilDue >= 0 && item.daysUntilDue <= 7 && item.status !== 'Done');
  const done = statusCounts.Done || 0;
  const total = decorated.length || 1;
  const averageConfidence = Math.round(decorated.reduce((sum, item) => sum + item.confidence, 0) / total);
  const averageHealth = Math.round(decorated.reduce((sum, item) => sum + item.healthScore, 0) / total);
  const effortRemaining = decorated.filter(item => item.status !== 'Done').reduce((sum, item) => sum + item.effort, 0);
  const readinessScore = Math.max(0, Math.min(100, Math.round((done / total) * 35 + averageConfidence * 0.35 + averageHealth * 0.25 - blockers.length * 4 - overdue.length * 5)));
  const recommendation = readinessScore >= 80 ? 'Release candidate is ready for stakeholder review.'
    : readinessScore >= 60 ? 'Release candidate is usable, but blockers should be resolved before launch.'
    : 'Release candidate needs focused delivery before launch readiness.';
  return {
    generatedAt: new Date().toISOString(),
    today: todayIso(),
    totals: { total: decorated.length, done, blockers: blockers.length, overdue: overdue.length, dueSoon: dueSoon.length, effortRemaining },
    statusCounts,
    priorityCounts,
    ownerCounts,
    averageConfidence,
    averageHealth,
    readinessScore,
    recommendation,
    blockers: blockers.map(compactItem),
    overdue: overdue.map(compactItem),
    dueSoon: dueSoon.map(compactItem)
  };
}

function countBy(items, key, known) {
  const out = Object.fromEntries(known.map(value => [value, 0]));
  for (const item of items) out[item[key]] = (out[item[key]] || 0) + 1;
  return out;
}

function compactItem(item) {
  return {
    id: item.id,
    title: item.title,
    owner: item.owner,
    status: item.status,
    priority: item.priority,
    due: item.due,
    confidence: item.confidence,
    risk: item.risk,
    healthScore: item.healthScore
  };
}

