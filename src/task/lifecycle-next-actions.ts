import { resolveHadaraActorContext, type HadaraActorContext, type HadaraActorRole } from '../core/actor-context';
import type { HadaraNextAction, HadaraStalePlanRisk, HadaraWriteBoundary } from '../core/next-action';

export interface TaskLifecycleNextAction extends HadaraNextAction {
  kind: 'command' | 'review';
  message: string;
  loopBoundary?: boolean;
}

export interface CreateTaskLifecycleNextActionOptions {
  id: string;
  kind?: 'command' | 'review';
  required: boolean;
  command?: string;
  message: string;
  writeBoundary: HadaraWriteBoundary;
  recommendedActorRole: HadaraActorRole;
  requiresBeforeHash: boolean;
  stalePlanRisk: HadaraStalePlanRisk;
  loopBoundary?: boolean;
}

export function createTaskLifecycleNextAction(options: CreateTaskLifecycleNextActionOptions): TaskLifecycleNextAction {
  return {
    id: options.id,
    kind: options.kind ?? 'command',
    required: options.required,
    command: options.command,
    message: options.message,
    summary: options.message,
    writeBoundary: options.writeBoundary,
    recommendedActorRole: options.recommendedActorRole,
    requiresBeforeHash: options.requiresBeforeHash,
    stalePlanRisk: options.stalePlanRisk,
    ...(options.loopBoundary === undefined ? {} : { loopBoundary: options.loopBoundary })
  };
}

export function selectPrimaryNextAction<T extends TaskLifecycleNextAction>(actions: T[]): T | undefined {
  return actions.find((action) => action.required) ?? actions[0];
}

export function defaultTaskLifecycleActor(): HadaraActorContext {
  return resolveHadaraActorContext().actor;
}
