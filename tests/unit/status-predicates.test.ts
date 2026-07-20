import { describe, expect, it } from 'vitest';
import { evaluatePredicate } from '../../src/status/predicates';
import { missingFact, presentFact } from '../../src/status/model';

const SOURCE = { sourceId: 'fixture', adapter: 'json-document' };

describe('status predicate vocabulary', () => {
  it('present/absent distinguish a present fact from a missing one', () => {
    const present = presentFact('k', 'x', SOURCE);
    const missing = missingFact('k', SOURCE);
    expect(evaluatePredicate('present', present)).toBe(true);
    expect(evaluatePredicate('present', missing)).toBe(false);
    expect(evaluatePredicate('absent', present)).toBe(false);
    expect(evaluatePredicate('absent', missing)).toBe(true);
    expect(evaluatePredicate('absent', undefined)).toBe(true);
  });

  it('equals compares the fact value', () => {
    expect(evaluatePredicate('equals', presentFact('k', 'T-0659', SOURCE), 'T-0659')).toBe(true);
    expect(evaluatePredicate('equals', presentFact('k', 'T-0001', SOURCE), 'T-0659')).toBe(false);
  });

  it('empty/not-empty cover strings, arrays, and objects', () => {
    expect(evaluatePredicate('empty', presentFact('k', '', SOURCE))).toBe(true);
    expect(evaluatePredicate('empty', presentFact('k', [], SOURCE))).toBe(true);
    expect(evaluatePredicate('empty', presentFact('k', {}, SOURCE))).toBe(true);
    expect(evaluatePredicate('not-empty', presentFact('k', ['x'], SOURCE))).toBe(true);
    expect(evaluatePredicate('empty', missingFact('k', SOURCE))).toBe(true);
  });

  it('contains checks array membership and substring containment', () => {
    expect(evaluatePredicate('contains', presentFact('k', ['a', 'b'], SOURCE), 'b')).toBe(true);
    expect(evaluatePredicate('contains', presentFact('k', 'authentication', SOURCE), 'auth')).toBe(true);
    expect(evaluatePredicate('contains', presentFact('k', ['a'], SOURCE), 'z')).toBe(false);
  });

  it('in checks the fact value against an allowed set', () => {
    expect(evaluatePredicate('in', presentFact('k', 'blocked', SOURCE), ['blocked', 'terminal'])).toBe(true);
    expect(evaluatePredicate('in', presentFact('k', 'ok', SOURCE), ['blocked', 'terminal'])).toBe(false);
  });

  it('always is unconditionally true regardless of fact state', () => {
    expect(evaluatePredicate('always', undefined)).toBe(true);
    expect(evaluatePredicate('always', missingFact('k', SOURCE))).toBe(true);
  });

  it('all/any combine pre-evaluated boolean results, not raw facts', () => {
    expect(evaluatePredicate('all', undefined, [true, true])).toBe(true);
    expect(evaluatePredicate('all', undefined, [true, false])).toBe(false);
    expect(evaluatePredicate('any', undefined, [false, true])).toBe(true);
    expect(evaluatePredicate('any', undefined, [false, false])).toBe(false);
  });
});
