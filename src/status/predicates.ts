import type { FactRecord } from './model';

export type PredicateName = 'equals' | 'present' | 'absent' | 'empty' | 'not-empty' | 'contains' | 'in' | 'all' | 'any' | 'always';

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function containsValue(value: unknown, needle: unknown): boolean {
  if (Array.isArray(value)) return value.includes(needle);
  if (typeof value === 'string' && typeof needle === 'string') return value.includes(needle);
  return false;
}

type ValuePredicateName = Exclude<PredicateName, 'all' | 'any'>;

const VALUE_PREDICATES: Record<ValuePredicateName, (value: unknown, args: unknown) => boolean> = {
  equals: (value, args) => value === args,
  present: (value) => value !== null && value !== undefined,
  absent: (value) => value === null || value === undefined,
  empty: (value) => isEmptyValue(value),
  'not-empty': (value) => !isEmptyValue(value),
  contains: (value, args) => containsValue(value, args),
  in: (value, args) => Array.isArray(args) && args.includes(value),
  always: () => true
};

/**
 * Closed predicate vocabulary from the Declarative DAG design (docx section 5.4).
 * No `eval`, shell, or arbitrary expression evaluation is permitted here or by any caller.
 */
export function evaluatePredicate(name: PredicateName, fact: FactRecord | undefined, args?: unknown): boolean {
  if (name === 'always') return true;
  if (name === 'all') return Array.isArray(args) && args.every((entry) => entry === true);
  if (name === 'any') return Array.isArray(args) && args.some((entry) => entry === true);
  if (fact === undefined || fact.state !== 'present') {
    return name === 'absent' || name === 'empty';
  }
  return VALUE_PREDICATES[name](fact.value, args);
}
