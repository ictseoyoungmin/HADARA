import { describe, expect, it } from 'vitest';
import { MockProvider } from '../../src/providers/mock-provider';
import { ScriptedProvider } from '../../src/providers/scripted-provider';

describe('Provider contract', () => {
  it('MockProvider returns normalized chat response', async () => {
    const provider = new MockProvider();
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'hello' }]
    });

    expect(response.provider).toBe('mock');
    expect(response.finishReason).toBe('stop');
    expect(response.content).toContain('hello');
  });

  it('MockProvider streams normalized events', async () => {
    const provider = new MockProvider();
    const events = [];
    for await (const event of provider.stream({ messages: [{ role: 'user', content: 'stream me' }] })) {
      events.push(event.type);
    }

    expect(events[0]).toBe('start');
    expect(events).toContain('delta');
    expect(events.at(-1)).toBe('finish');
  });

  it('ScriptedProvider returns deterministic responses', async () => {
    const provider = new ScriptedProvider([{ match: 'hello', response: 'scripted hello' }]);
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'hello' }],
      timeoutMs: 1000,
      retry: { maxAttempts: 1, backoffMs: 0 },
      fallbackModels: ['scripted-fallback']
    });

    expect(response.provider).toBe('scripted');
    expect(response.content).toBe('scripted hello');
    expect(response.usage).toBeUndefined();
  });

  it('ScriptedProvider consumes matching steps in order', async () => {
    const provider = new ScriptedProvider([
      { match: 'repeat', response: 'first response' },
      { match: 'repeat', response: 'second response' }
    ]);

    await expect(provider.chat({ messages: [{ role: 'user', content: 'repeat' }] })).resolves.toMatchObject({
      content: 'first response'
    });
    await expect(provider.chat({ messages: [{ role: 'user', content: 'repeat' }] })).resolves.toMatchObject({
      content: 'second response'
    });
  });

  it('ScriptedProvider fails when the current step does not match', async () => {
    const provider = new ScriptedProvider([
      { match: 'first', response: 'first response' },
      { match: 'second', response: 'second response' }
    ]);

    await expect(provider.chat({ messages: [{ role: 'user', content: 'first' }] })).resolves.toMatchObject({
      content: 'first response'
    });
    await expect(provider.chat({ messages: [{ role: 'user', content: 'first' }] })).rejects.toMatchObject({
      provider: 'scripted',
      code: 'SCRIPTED_PROVIDER_ERROR',
      retriable: false,
      message: expect.stringContaining('step 2 expected message containing "second"')
    });
  });

  it('ScriptedProvider emits start before terminal stream events', async () => {
    const provider = new ScriptedProvider([{ match: 'stream', response: 'scripted stream' }]);
    const events = [];
    for await (const event of provider.stream({ messages: [{ role: 'user', content: 'stream' }] })) {
      events.push(event.type);
    }

    expect(events[0]).toBe('start');
    expect(events.at(-1)).toBe('finish');
  });

  it('ScriptedProvider normalizes unmatched scripts as non-retriable errors', async () => {
    const provider = new ScriptedProvider([]);
    const events = [];
    for await (const event of provider.stream({ messages: [{ role: 'user', content: 'missing' }] })) {
      events.push(event);
    }

    expect(events[0]).toMatchObject({ type: 'start' });
    expect(events.at(-1)).toMatchObject({ type: 'error', retriable: false });
  });
});
