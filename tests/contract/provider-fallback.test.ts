import { describe, expect, it } from 'vitest';
import { chatWithProviderFallback, ProviderFallbackError } from '../../src/providers/fallback-executor';
import { MockProvider } from '../../src/providers/mock-provider';
import { ScriptedProvider } from '../../src/providers/scripted-provider';

describe('Provider fallback executor', () => {
  it('returns the first successful provider response without trying later providers', async () => {
    const primary = new ScriptedProvider([{ match: 'hello', response: 'primary response' }]);
    const fallback = new MockProvider();

    const result = await chatWithProviderFallback([primary, fallback], {
      messages: [{ role: 'user', content: 'hello' }]
    });

    expect(result.response).toMatchObject({
      provider: 'scripted',
      content: 'primary response',
      finishReason: 'stop'
    });
    expect(result.attempts).toEqual([{ provider: 'scripted', ok: true, model: 'scripted-model' }]);
  });

  it('falls back to the next provider after a failed primary', async () => {
    const failingPrimary = new ScriptedProvider([]);
    const fallback = new MockProvider();

    const result = await chatWithProviderFallback([failingPrimary, fallback], {
      messages: [{ role: 'user', content: 'hello fallback' }]
    });

    expect(result.response.provider).toBe('mock');
    expect(result.response.content).toContain('hello fallback');
    expect(result.attempts).toHaveLength(2);
    expect(result.attempts[0]).toMatchObject({
      provider: 'scripted',
      ok: false,
      error: {
        provider: 'scripted',
        code: 'SCRIPTED_PROVIDER_ERROR',
        retriable: false
      }
    });
    expect(result.attempts[1]).toMatchObject({ provider: 'mock', ok: true, model: 'mock-model' });
  });

  it('raises a structured fallback error when all providers fail', async () => {
    const first = new ScriptedProvider([]);
    const second = new ScriptedProvider([]);

    await expect(
      chatWithProviderFallback([first, second], {
        messages: [{ role: 'user', content: 'missing' }]
      })
    ).rejects.toMatchObject({
      name: 'ProviderFallbackError',
      attempts: [
        {
          provider: 'scripted',
          ok: false,
          error: {
            code: 'SCRIPTED_PROVIDER_ERROR'
          }
        },
        {
          provider: 'scripted',
          ok: false,
          error: {
            code: 'SCRIPTED_PROVIDER_ERROR'
          }
        }
      ]
    });
  });

  it('raises a structured fallback error when no providers are configured', async () => {
    await expect(
      chatWithProviderFallback([], {
        messages: [{ role: 'user', content: 'hello' }]
      })
    ).rejects.toBeInstanceOf(ProviderFallbackError);
  });
});

