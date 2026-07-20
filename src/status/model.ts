export type EvaluationState = 'evaluated' | 'not-evaluated' | 'unavailable' | 'stale' | 'invalid' | 'partial';

export type FactAuthority = 'canonical' | 'declared' | 'projection' | 'fallback' | 'observed';

export type FactState = 'present' | 'missing' | 'invalid' | 'stale' | 'ambiguous';

export interface FactSource {
  sourceId: string;
  path?: string;
  selector?: string;
  adapter: string;
  contentHash?: string;
}

export interface FactFreshness {
  status: 'current' | 'changed' | 'unknown';
  comparedTo?: string;
}

export interface FactRecord<T = unknown> {
  key: string;
  value: T | null;
  state: FactState;
  authority: FactAuthority;
  source: FactSource;
  freshness: FactFreshness;
}

export function presentFact<T>(
  key: string,
  value: T,
  source: FactSource,
  options: { authority?: FactAuthority; freshness?: FactFreshness } = {}
): FactRecord<T> {
  return {
    key,
    value,
    state: 'present',
    authority: options.authority ?? 'observed',
    source,
    freshness: options.freshness ?? { status: 'current' }
  };
}

export function missingFact<T = unknown>(key: string, source: FactSource, authority: FactAuthority = 'observed'): FactRecord<T> {
  return { key, value: null, state: 'missing', authority, source, freshness: { status: 'unknown' } };
}

export function invalidFact<T = unknown>(key: string, source: FactSource, authority: FactAuthority = 'observed'): FactRecord<T> {
  return { key, value: null, state: 'invalid', authority, source, freshness: { status: 'unknown' } };
}

export function mapFact<T, U>(fact: FactRecord<T>, transform: (value: T) => U): FactRecord<U> {
  if (fact.state !== 'present' || fact.value === null) return fact as unknown as FactRecord<U>;
  return { ...fact, value: transform(fact.value) };
}

export interface FactStore {
  facts: Map<string, FactRecord>;
}

export function createFactStore(records: FactRecord[] = []): FactStore {
  const facts = new Map<string, FactRecord>();
  for (const record of records) facts.set(record.key, record);
  return { facts };
}

export function putFact(store: FactStore, record: FactRecord): FactStore {
  store.facts.set(record.key, record);
  return store;
}

export function getFact<T = unknown>(store: FactStore, key: string): FactRecord<T> | undefined {
  return store.facts.get(key) as FactRecord<T> | undefined;
}
