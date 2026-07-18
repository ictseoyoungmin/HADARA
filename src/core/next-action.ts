import type { HadaraActorRole } from './actor-context';

export const HADARA_WRITE_BOUNDARIES = [
  'read-only',
  'task-local',
  'evidence-append',
  'task-close-transaction',
  'shared-doc',
  'dist-sync',
  'release-artifact',
  'external-subprocess',
  'release-mutation',
  'unknown'
] as const;

export type HadaraWriteBoundary = (typeof HADARA_WRITE_BOUNDARIES)[number];

export const HADARA_STALE_PLAN_RISKS = ['none', 'low', 'medium', 'high', 'unknown'] as const;

export type HadaraStalePlanRisk = (typeof HADARA_STALE_PLAN_RISKS)[number];

export interface HadaraNextAction {
  id: string;
  command?: string;
  summary: string;
  required: boolean;
  writeBoundary: HadaraWriteBoundary;
  recommendedActorRole: HadaraActorRole;
  requiresBeforeHash: boolean;
  stalePlanRisk: HadaraStalePlanRisk;
}
