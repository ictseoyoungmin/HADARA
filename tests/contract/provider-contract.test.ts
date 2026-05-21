import { describe, expect, it } from 'vitest';
import { MockProvider } from '../../src/providers/mock-provider';

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
});
