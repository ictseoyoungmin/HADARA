import { describe, expect, it } from 'vitest';
import { createFactStore, getFact, invalidFact, mapFact, missingFact, presentFact, putFact } from '../../src/status/model';

const SOURCE = { sourceId: 'fixture', adapter: 'json-document' };

describe('status fact model', () => {
  it('presentFact defaults to observed authority and current freshness', () => {
    const fact = presentFact('project.release', '0.5.0-rc.0', SOURCE);
    expect(fact).toMatchObject({
      key: 'project.release',
      value: '0.5.0-rc.0',
      state: 'present',
      authority: 'observed',
      freshness: { status: 'current' }
    });
  });

  it('presentFact accepts explicit authority and freshness', () => {
    const fact = presentFact('project.release', '0.5.0-rc.0', SOURCE, { authority: 'canonical', freshness: { status: 'stale', comparedTo: 'x' } });
    expect(fact.authority).toBe('canonical');
    expect(fact.freshness).toEqual({ status: 'stale', comparedTo: 'x' });
  });

  it('missingFact and invalidFact never represent absence as a healthy value', () => {
    expect(missingFact('k', SOURCE).state).toBe('missing');
    expect(missingFact('k', SOURCE).value).toBeNull();
    expect(invalidFact('k', SOURCE).state).toBe('invalid');
  });

  it('mapFact transforms only present facts, passing missing/invalid through unchanged', () => {
    const present = presentFact('k', 2, SOURCE);
    expect(mapFact(present, (n) => n * 10).value).toBe(20);

    const missing = missingFact('k', SOURCE);
    const mapped = mapFact(missing, () => {
      throw new Error('must not run');
    });
    expect(mapped.state).toBe('missing');
    expect(mapped.value).toBeNull();
  });

  it('fact store put/get round-trips by key', () => {
    const store = createFactStore([presentFact('a', 1, SOURCE)]);
    putFact(store, presentFact('b', 2, SOURCE));
    expect(getFact(store, 'a')?.value).toBe(1);
    expect(getFact(store, 'b')?.value).toBe(2);
    expect(getFact(store, 'missing-key')).toBeUndefined();
  });
});
