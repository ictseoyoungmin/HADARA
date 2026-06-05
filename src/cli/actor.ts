import { isHadaraActorRole, resolveHadaraActorContext, type HadaraActorContext } from '../core/actor-context';
import { getStringOption } from './args';

export function getActorContextOption(args: string[]): HadaraActorContext | undefined {
  const agentId = getStringOption(args, '--agent-id');
  const runId = getStringOption(args, '--run-id');
  const role = getStringOption(args, '--actor-role');
  const parentRunId = getStringOption(args, '--parent-run-id');
  if (agentId === undefined && runId === undefined && role === undefined && parentRunId === undefined) return undefined;
  if (role !== undefined && !isHadaraActorRole(role)) {
    throw new Error(`unsupported --actor-role: ${role}`);
  }
  return resolveHadaraActorContext({ agentId, runId, role, parentRunId }).actor;
}
